/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import com.google.common.collect.Iterables;
import de.eshg.lib.common.TimeoutConstants;
import de.eshg.security.auth.login.LoginMethod;
import java.time.Clock;
import java.util.List;
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
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.CrossOriginResourcePolicyHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.AnyRequestMatcher;

@Configuration
public class AuthServiceSecurityConfig {

  // We explicitly reconfigure the Spring OAuth client endpoints to live under /auth
  // This makes it easier to configure the proxy_pass in the Nginx reverse proxy.
  private static final String AUTHORIZATION_ENDPOINT_BASE_URL = "/auth";
  private static final String LOGIN_PROCESSING_BASE_URL =
      AUTHORIZATION_ENDPOINT_BASE_URL + "/login";

  static final String LOGOUT_URL = "/logout";

  private static final AntPathRequestMatcher LOGOUT_REQUEST_MATCHER =
      new AntPathRequestMatcher(LOGOUT_URL, HttpMethod.GET.name());

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
      ClientRegistrationRepository clientRegistrationRepository,
      CsrfTokenRepository csrfTokenRepository)
      throws Exception {
    return http.authorizeHttpRequests(
            auth -> {
              auth.requestMatchers(
                      HttpMethod.GET,
                      "/actuator/health",
                      "/actuator/health/liveness",
                      "/actuator/health/readiness")
                  .permitAll();
              auth.requestMatchers(HttpMethod.GET, "/browser_update_required.html").permitAll();

              auth.requestMatchers(HttpMethod.GET, LogoutController.INITIATE_LOGOUT_URL)
                  .authenticated();

              auth.requestMatchers(HttpMethod.GET, AuthController.BASE_URL).authenticated();

              auth.anyRequest().denyAll();
            })
        .oauth2Login(
            oauth2 ->
                oauth2
                    .successHandler(oauthLoginSuccessHandler)
                    .loginProcessingUrl(LOGIN_PROCESSING_BASE_URL + "/*")
                    .authorizationEndpoint(
                        authorizationEndpointConfig ->
                            authorizationEndpointConfig
                                .baseUri(AUTHORIZATION_ENDPOINT_BASE_URL)
                                .authorizationRequestResolver(
                                    new LoginMethodAwareAuthorizationRequestResolver(
                                        clientRegistrationRepository,
                                        loginMethods,
                                        AUTHORIZATION_ENDPOINT_BASE_URL))))
        .logout(
            logout ->
                logout
                    .logoutUrl(LOGOUT_URL)
                    .logoutRequestMatcher(LOGOUT_REQUEST_MATCHER)
                    .logoutSuccessHandler(logoutSuccessHandler(clientRegistrationRepository))
                    .deleteCookies(LogoutController.CSRF_TOKEN_COOKIE_NAME))
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
