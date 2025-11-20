/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.config;

import static de.eshg.lib.common.EshgHttpHeaders.X_ESHG_CERT_SUBJECT;
import static de.eshg.libservicedirectoryadminapi.AdminCertHttpHeaders.X_ESHG_CLIENT_CERT;

import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.DefaultEshgSecurityConfig;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.util.X509Utils;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.security.web.context.NullSecurityContextRepository;
import org.springframework.util.AntPathMatcher;

@Configuration
public class ServiceDirectorySecurityConfig {

  private static final Logger log = LoggerFactory.getLogger(ServiceDirectorySecurityConfig.class);
  private static final List<String> permitAllRoutes =
      List.of(
          "/actuator/health",
          "/actuator/health/liveness",
          "/actuator/health/readiness",
          "/test-helper/**",
          "/actuator/prometheus");

  /**
   * authenticate clients by header "X-ESHG-cert-subject" requests to /adminapi additionally need
   * the user's certificate in the header "X-ESHG-client-cert" in URL-encoded PEM format
   */
  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http,
      List<AuthorizationCustomizer> authorizationCustomizer,
      @Value("${eshg.sd.allowed-admin-client-commonnames:}")
          List<String> allowedAdminClientCommonNames,
      @Value("${eshg.sd.admin-certs:}") String adminCerts)
      throws Exception {
    NoOpAuthenticationManager authenticationManager = new NoOpAuthenticationManager();
    List<String> certificates = splitCertificates(adminCerts);
    EshgHeaderPreAuthenticatedProcessingFilter eshgHeaderPreAuthenticatedProcessingFilter =
        new EshgHeaderPreAuthenticatedProcessingFilter();
    eshgHeaderPreAuthenticatedProcessingFilter.setAuthenticationManager(authenticationManager);
    eshgHeaderPreAuthenticatedProcessingFilter.setSecurityContextRepository(
        new NullSecurityContextRepository());

    return http.authorizeHttpRequests(
            auth -> {
              authorizationCustomizer.forEach(c -> c.customize(auth));
              auth.requestMatchers(HttpMethod.GET, permitAllRoutes.toArray(new String[0]))
                  .permitAll();
              auth.requestMatchers("/adminapi/**")
                  .access(isAdmin(allowedAdminClientCommonNames, certificates));
              auth.anyRequest().authenticated();
            })
        .authenticationManager(authenticationManager)
        .csrf(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable)
        .sessionManagement(AbstractHttpConfigurer::disable)
        .addFilter(eshgHeaderPreAuthenticatedProcessingFilter)
        .headers(DefaultEshgSecurityConfig::securityHeaders)
        .build();
  }

  private AuthorizationManager<RequestAuthorizationContext> isAdmin(
      List<String> allowedAdminClientCommonNames, List<String> certificates) {
    return (authentication, requestAuthorizationContext) -> {
      String callingClientCommonName = authentication.get().getName();
      boolean calledFromAllowedClient =
          containsIgnoringCase(allowedAdminClientCommonNames, callingClientCommonName);
      if (!calledFromAllowedClient) {
        log.warn(
            "attempt to call ServiceDirectoryAdminApi from unknown client: {}",
            callingClientCommonName);
        return new AuthorizationDecision(false);
      }

      String certificateHeaderValue =
          getHeaderValue(requestAuthorizationContext.getRequest(), X_ESHG_CLIENT_CERT.headerName);
      String pem =
          X509Utils.normalizePem(URLDecoder.decode(certificateHeaderValue, StandardCharsets.UTF_8));

      String adminCommonName = X509Utils.extractSanOrCommonName(X509Utils.parsePem(pem));

      boolean calledByAllowedCertificate = certificates.contains(pem);
      if (!calledByAllowedCertificate) {
        log.warn("attempt to call ServiceDirectoryAdminApi with invalid certificate value");
        return new AuthorizationDecision(false);
      }
      AdminNameHolder.setAdminName(adminCommonName);
      return new AuthorizationDecision(true);
    };
  }

  private static boolean containsIgnoringCase(List<String> haystack, String needle) {
    return haystack.stream().anyMatch(straw -> straw.equalsIgnoreCase(needle));
  }

  private static String getHeaderValue(HttpServletRequest request, String headerName) {
    return request.getHeader(headerName);
  }

  public static class EshgHeaderPreAuthenticatedProcessingFilter
      extends AbstractPreAuthenticatedProcessingFilter {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected String getPreAuthenticatedPrincipal(HttpServletRequest request) {
      if (HttpMethod.GET.matches(request.getMethod())
          && permitAllRoutes.stream()
              .anyMatch(route -> pathMatcher.match(route, request.getRequestURI()))) {
        log.debug("Skipping getPreAuthenticatedPrincipal for {}", request.getRequestURI());
        return null;
      }
      return extractCN(request, X_ESHG_CERT_SUBJECT.headerName);
    }

    @Override
    protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
      return "N/A";
    }

    private static String extractCN(HttpServletRequest request, String headerName) {
      String subject = request.getHeader(headerName);
      if (StringUtils.isBlank(subject)) {
        log.warn("Blank header {}", headerName);
        return null;
      }
      LdapName name = createLdapName(subject, headerName);
      if (name == null) {
        return null;
      }

      String cn =
          name.getRdns().stream()
              .filter(rdn -> rdn.getType().equalsIgnoreCase("CN"))
              .map(rdn -> rdn.getValue().toString())
              .findFirst()
              .orElse(null);
      if (StringUtils.isBlank(cn)) {
        log.warn("Blank CN in header {}: {}", headerName, subject);
      }
      return cn;
    }

    private static LdapName createLdapName(String subject, String headerName) {
      try {
        return new LdapName(subject);
      } catch (InvalidNameException e) {
        log.error("Invalid header {}: {}", headerName, subject, e);
        return null;
      }
    }
  }

  private static List<String> splitCertificates(String certs) {
    String[] certificates = certs.split("-----END CERTIFICATE-----");
    return Arrays.stream(certificates)
        .filter(e -> !e.isBlank())
        .map(e -> e + "-----END CERTIFICATE-----")
        .map(X509Utils::normalizePem)
        .toList();
  }

  private static class NoOpAuthenticationManager implements AuthenticationManager {

    @Override
    public Authentication authenticate(Authentication authentication)
        throws AuthenticationException {
      authentication.setAuthenticated(true);
      return authentication;
    }
  }
}
