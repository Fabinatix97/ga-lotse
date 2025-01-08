/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.config;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import de.eshg.lib.common.EshgHttpHeaders;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.DefaultEshgSecurityConfig;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

@Configuration
public class CentralRepositorySecurityConfig {

  /**
   * authenticate user by valid client certificate or by a header "X-ESHG-cert-subject" specified by
   * the client
   */
  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http, List<AuthorizationCustomizer> authorizationCustomizer) throws Exception {
    NoOpAuthenticationManager authenticationManager = new NoOpAuthenticationManager();

    EshgHeaderPreAuthenticatedProcessingFilter eshgHeaderPreAuthenticatedProcessingFilter =
        new EshgHeaderPreAuthenticatedProcessingFilter();
    eshgHeaderPreAuthenticatedProcessingFilter.setAuthenticationManager(authenticationManager);

    return http.authorizeHttpRequests(
            auth -> {
              authorizationCustomizer.forEach(c -> c.customize(auth));
              auth.requestMatchers(
                      HttpMethod.GET,
                      "/actuator/health",
                      "/actuator/health/liveness",
                      "/actuator/health/readiness")
                  .permitAll();
              auth.requestMatchers(HttpMethod.GET, "/actuator/prometheus").permitAll();
              auth.anyRequest().authenticated();
            })
        .authenticationManager(authenticationManager)
        .csrf(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable)
        .sessionManagement(customizer -> customizer.sessionCreationPolicy(STATELESS))
        .addFilter(eshgHeaderPreAuthenticatedProcessingFilter)
        .headers(DefaultEshgSecurityConfig::securityHeaders)
        .build();
  }

  public static class EshgHeaderPreAuthenticatedProcessingFilter
      extends AbstractPreAuthenticatedProcessingFilter {

    @Override
    protected String getPreAuthenticatedPrincipal(HttpServletRequest request) {
      var subject = request.getHeader(EshgHttpHeaders.X_ESHG_CERT_SUBJECT.headerName);
      if (StringUtils.isBlank(subject)) {
        return null;
      }
      LdapName name = createLdapName(subject);
      if (name == null) {
        return null;
      }

      return name.getRdns().stream()
          .filter(rdn -> rdn.getType().equalsIgnoreCase("CN"))
          .map(rdn -> rdn.getValue().toString())
          .findFirst()
          .orElse(null);
    }

    @Override
    protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
      return "N/A";
    }

    private static final Logger LOG =
        LoggerFactory.getLogger(EshgHeaderPreAuthenticatedProcessingFilter.class);

    private static LdapName createLdapName(String subject) {
      try {
        return new LdapName(subject);
      } catch (InvalidNameException e) {
        LOG.error("Invalid " + EshgHttpHeaders.X_ESHG_CERT_SUBJECT.headerName + " header", e);
        return null;
      }
    }
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
