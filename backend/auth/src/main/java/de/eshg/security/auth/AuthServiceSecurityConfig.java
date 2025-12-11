/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import com.google.common.collect.Iterables;
import de.eshg.lib.common.TimeoutConstants;
import de.eshg.security.auth.login.LoginMethod;
import de.eshg.security.auth.login.LoginMethodTypeChangeFilter;
import de.eshg.security.auth.login.LoginMethodTypeHolder;
import de.eshg.security.auth.synapse.SynapseAuthController;
import de.eshg.security.auth.synapse.SynapseLogoutHandler;
import java.time.Clock;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.CrossOriginResourcePolicyHeaderWriter;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.AnyRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatchers;

@Configuration
public class AuthServiceSecurityConfig {

  private static final Logger log = LoggerFactory.getLogger(AuthServiceSecurityConfig.class);
  public static final RequestMatcher actuatorMonitoringRequestMatcher =
      RequestMatchers.anyOf(
          PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.GET, "/actuator/health"),
          PathPatternRequestMatcher.withDefaults()
              .matcher(HttpMethod.GET, "/actuator/health/liveness"),
          PathPatternRequestMatcher.withDefaults()
              .matcher(HttpMethod.GET, "/actuator/health/readiness"));

  // We explicitly reconfigure the Spring OAuth client endpoints to live under /auth
  // This makes it easier to configure the proxy_pass in the Nginx reverse proxy.
  private static final String AUTHORIZATION_ENDPOINT_BASE_URL = "/auth";
  private static final String LOGIN_PROCESSING_BASE_URL =
      AUTHORIZATION_ENDPOINT_BASE_URL + "/login";

  static final String LOGOUT_URL = "/logout";
  private static final String LOGIN_ERROR_URL = "/login-error";

  private static final PathPatternRequestMatcher LOGOUT_REQUEST_MATCHER =
      PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.GET, LOGOUT_URL);

  /*
   * Make sure that the access-/refresh tokens are stored in the session (i.e. in Redis)
   * instead of keeping them in-memory.
   *
   * Spring Boot’s default is to create a InMemoryOAuth2AuthorizedClientService
   * See org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2WebSecurityConfiguration.authorizedClientService
   */
  @Bean
  public OAuth2AuthorizedClientRepository authorizedClientRepository() {
    return new HttpSessionOAuth2AuthorizedClientRepository();
  }

  @Bean
  RedirectToAuthorizationEndpoint redirectToAuthorizationEndpoint(
      OAuth2ClientProperties auth2ClientProperties) {
    String oauthProvider = getSingleOAuthProviderName(auth2ClientProperties);
    String authorizationEndpointUrl = AUTHORIZATION_ENDPOINT_BASE_URL + "/" + oauthProvider;
    return new RedirectToAuthorizationEndpoint(authorizationEndpointUrl);
  }

  @Bean
  @ConditionalOnProperty(value = "eshg.auth.user-agent-filter.enabled", havingValue = "true")
  public FilterRegistrationBean<UserAgentFilter> userAgentFilter(AuthProperties authProperties) {
    FilterRegistrationBean<UserAgentFilter> userAgentFilterRegistrationBean =
        new FilterRegistrationBean<>();
    userAgentFilterRegistrationBean.setFilter(new UserAgentFilter(authProperties));
    userAgentFilterRegistrationBean.addUrlPatterns(AuthController.BASE_URL);
    // Register UserAgentFilter _before_ the security filter chain
    userAgentFilterRegistrationBean.setOrder(SecurityProperties.DEFAULT_FILTER_ORDER - 1);

    return userAgentFilterRegistrationBean;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http,
      List<LoginMethod> loginMethods,
      ReverseProxyAwareSavedRequestAwareAuthenticationSuccessHandler oauthLoginSuccessHandler,
      @Autowired(required = false) SynapseLogoutHandler synapseLogoutHandler,
      ClientRegistrationRepository clientRegistrationRepository,
      LoginMethodTypeHolder loginMethodTypeHolder,
      CsrfTokenRepository csrfTokenRepository,
      LoginMethodTypeChangeFilter loginMethodTypeChangeFilter)
      throws Exception {
    return http.authorizeHttpRequests(
            auth -> {
              auth.requestMatchers(actuatorMonitoringRequestMatcher).permitAll();
              auth.requestMatchers(HttpMethod.GET, "/browser_update_required.html").permitAll();
              auth.requestMatchers(HttpMethod.GET, "/login_error.html").permitAll();

              auth.requestMatchers(HttpMethod.GET, LogoutController.INITIATE_LOGOUT_URL)
                  .authenticated();

              auth.requestMatchers(HttpMethod.GET, AuthController.BASE_URL).authenticated();
              auth.requestMatchers(HttpMethod.GET, SynapseAuthController.BASE_URL).authenticated();

              auth.anyRequest().denyAll();
            })
        .oauth2Login(
            oauth2 ->
                oauth2
                    .successHandler(oauthLoginSuccessHandler)
                    .loginProcessingUrl(LOGIN_PROCESSING_BASE_URL + "/*")
                    .failureUrl(LOGIN_ERROR_URL)
                    .authorizationEndpoint(
                        authorizationEndpointConfig ->
                            authorizationEndpointConfig
                                .baseUri(AUTHORIZATION_ENDPOINT_BASE_URL)
                                .authorizationRequestResolver(
                                    new LoginMethodAwareAuthorizationRequestResolver(
                                        clientRegistrationRepository,
                                        loginMethods,
                                        AUTHORIZATION_ENDPOINT_BASE_URL,
                                        loginMethodTypeHolder))))
        .logout(
            logout -> {
              logout
                  .logoutUrl(LOGOUT_URL)
                  .logoutRequestMatcher(LOGOUT_REQUEST_MATCHER)
                  .logoutSuccessHandler(logoutSuccessHandler(clientRegistrationRepository))
                  .addLogoutHandler(new LogoutCsrfTokenCookieClearingLogoutHandler());
              if (synapseLogoutHandler != null) {
                log.info("Adding logout handler for Synapse");
                logout.addLogoutHandler(synapseLogoutHandler);
              }
            })
        .csrf(
            csrf ->
                csrf.csrfTokenRepository(csrfTokenRepository)
                    .csrfTokenRequestHandler(new CsrfTokenRequestHandlerFromCookie())
                    .requireCsrfProtectionMatcher(LOGOUT_REQUEST_MATCHER))
        .anonymous(AbstractHttpConfigurer::disable)
        .headers(
            headers ->
                headers
                    .httpStrictTransportSecurity(
                        hsts ->
                            hsts.maxAgeInSeconds(31536000)
                                .includeSubDomains(true)
                                // Enabled HSTS even when the request is sent via unsecured HTTP,
                                // to allow for consistent tests and proxying
                                .requestMatcher(AnyRequestMatcher.INSTANCE))
                    .crossOriginOpenerPolicy(
                        opener ->
                            opener.policy(
                                CrossOriginOpenerPolicyHeaderWriter.CrossOriginOpenerPolicy
                                    .SAME_ORIGIN))
                    .crossOriginResourcePolicy(
                        resource ->
                            resource.policy(
                                CrossOriginResourcePolicyHeaderWriter.CrossOriginResourcePolicy
                                    .SAME_ORIGIN))
                    .xssProtection(HeadersConfigurer.XXssConfig::disable))
        .addFilterAfter(loginMethodTypeChangeFilter, AuthorizationFilter.class)
        .build();
  }

  @Bean
  CsrfTokenRepository csrfTokenRepository() {
    return new HttpSessionCsrfTokenRepository();
  }

  private static String getSingleOAuthProviderName(OAuth2ClientProperties auth2ClientProperties) {
    return Iterables.getOnlyElement(auth2ClientProperties.getRegistration().keySet());
  }

  // The only reason we need this lengthy code is to inject a custom clock 🤨
  // see https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html
  @Bean
  OAuth2AuthorizedClientManager authorizedClientManager(
      Clock clock,
      ClientRegistrationRepository clientRegistrationRepository,
      OAuth2AuthorizedClientRepository authorizedClientRepository) {

    OAuth2AuthorizedClientProvider authorizedClientProvider =
        OAuth2AuthorizedClientProviderBuilder.builder()
            .authorizationCode()
            .refreshToken(
                refreshTokenGrantBuilder ->
                    refreshTokenGrantBuilder
                        .clockSkew(TimeoutConstants.LONG_RUNNING_OPERATION_TIMEOUT)
                        .clock(clock))
            .build();

    DefaultOAuth2AuthorizedClientManager authorizedClientManager =
        new DefaultOAuth2AuthorizedClientManager(
            clientRegistrationRepository, authorizedClientRepository);
    authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

    return authorizedClientManager;
  }

  private static LogoutSuccessHandler logoutSuccessHandler(
      ClientRegistrationRepository clientRegistrationRepository) {
    OidcClientInitiatedLogoutSuccessHandler oidcClientInitiatedLogoutSuccessHandler =
        new OidcClientInitiatedLogoutSuccessHandler(clientRegistrationRepository);
    oidcClientInitiatedLogoutSuccessHandler.setPostLogoutRedirectUri("/");
    return oidcClientInitiatedLogoutSuccessHandler;
  }
}
