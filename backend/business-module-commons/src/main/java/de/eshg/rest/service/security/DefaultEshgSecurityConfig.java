/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.rest.service.security.EshgOAuth2ResourceServerProperties.EshgJwt;
import de.eshg.rest.service.security.config.AbstractPublicSecurityConfiguration;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.env.EnumerablePropertySource;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtIssuerAuthenticationManagerResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter.CrossOriginOpenerPolicy;
import org.springframework.security.web.header.writers.CrossOriginResourcePolicyHeaderWriter.CrossOriginResourcePolicy;
import org.springframework.security.web.util.matcher.AnyRequestMatcher;

@EnableWebSecurity
@EnableConfigurationProperties(EshgOAuth2ResourceServerProperties.class)
public class DefaultEshgSecurityConfig {

  private static final Logger log = LoggerFactory.getLogger(DefaultEshgSecurityConfig.class);

  private final EshgOAuth2ResourceServerProperties resourceServerProperties;

  private final List<OAuth2TokenValidator<Jwt>> additionalJwtValidators;

  DefaultEshgSecurityConfig(
      EshgOAuth2ResourceServerProperties resourceServerProperties,
      ObjectProvider<OAuth2TokenValidator<Jwt>> additionalJwtValidators) {
    this.resourceServerProperties = resourceServerProperties;
    this.additionalJwtValidators = additionalJwtValidators.orderedStream().toList();
  }

  @Bean
  @ConditionalOnTestHelperEnabled
  AuthorizationCustomizer testHelperSecurityConfig() {
    return auth -> auth.requestMatchers("/test-helper/**").permitAll();
  }

  @Bean
  @Profile("test")
  AuthorizationCustomizer apiDocsSecurityConfig() {
    return auth -> auth.requestMatchers(HttpMethod.GET, "/api-docs.yaml").permitAll();
  }

  @Bean
  @ConditionalOnMissingBean(SecurityFilterChain.class)
  public SecurityFilterChain defaultEshgSecurityChain(
      AbstractEnvironment environment,
      List<AbstractPublicSecurityConfiguration> publicSecurityConfigurations,
      HttpSecurity http,
      List<AuthorizationCustomizer> authorizationCustomizer)
      throws Exception {
    validateSpringOAuth2PropertiesNotSet(environment);

    return http.authorizeHttpRequests(
            authRegistry -> {
              publicSecurityConfigurations.forEach(c -> c.customize(authRegistry));
              authorizationCustomizer.forEach(c -> c.customize(authRegistry));
              authRegistry
                  .requestMatchers(
                      HttpMethod.GET,
                      "/actuator/health",
                      "/actuator/health/liveness",
                      "/actuator/health/readiness")
                  .permitAll();
              authRegistry.requestMatchers(HttpMethod.GET, "/actuator/prometheus").permitAll();
              authRegistry.anyRequest().denyAll();
            })
        .anonymous(AbstractHttpConfigurer::disable)
        .oauth2ResourceServer(
            auth2 -> auth2.authenticationManagerResolver(authenticationManagerResolver()))
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(AbstractHttpConfigurer::disable)
        .headers(DefaultEshgSecurityConfig::securityHeaders)
        .addFilterAfter(new UserSessionIdLoggingFilter(), AuthorizationFilter.class)
        .build();
  }

  public static void securityHeaders(HeadersConfigurer<HttpSecurity> headers) {
    headers
        .httpStrictTransportSecurity(
            hsts ->
                hsts.maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                    // Enabled HSTS even when the request is sent via unsecured HTTP,
                    // to allow for consistent tests and proxying
                    .requestMatcher(AnyRequestMatcher.INSTANCE))
        .crossOriginOpenerPolicy(opener -> opener.policy(CrossOriginOpenerPolicy.SAME_ORIGIN))
        .crossOriginResourcePolicy(
            resource -> resource.policy(CrossOriginResourcePolicy.SAME_ORIGIN))
        .xssProtection(HeadersConfigurer.XXssConfig::disable);
  }

  private static void validateSpringOAuth2PropertiesNotSet(AbstractEnvironment env) {
    List<String> foundSpringOAuth2Properties = getSpringOauth2ResourceserverProperties(env);

    if (!foundSpringOAuth2Properties.isEmpty()) {
      throw new IllegalArgumentException(
          getSpringOauth2ValidationErrorMessage(foundSpringOAuth2Properties));
    }
  }

  private static List<String> getSpringOauth2ResourceserverProperties(AbstractEnvironment env) {
    return env.getPropertySources().stream()
        .filter(EnumerablePropertySource.class::isInstance)
        .map(EnumerablePropertySource.class::cast)
        .flatMap(
            propertySource ->
                Arrays.stream(propertySource.getPropertyNames())
                    .map(String::toLowerCase)
                    // see prefix of
                    // org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties
                    .filter(name -> name.startsWith("spring.security.oauth2.resourceserver."))
                    .map(name -> "%s=%s".formatted(name, propertySource.getProperty(name))))
        .toList();
  }

  private static String getSpringOauth2ValidationErrorMessage(
      List<String> foundSpringOAuth2Properties) {
    StringBuilder foundPropertiesString = new StringBuilder();
    for (String property : foundSpringOAuth2Properties) {
      foundPropertiesString.append(" - %s%n".formatted(property));
    }
    return "Using 'spring.security.oauth2.resourceserver.*' properties to configure oauth2 security will have no effect with the current setup! "
        + "Use the custom 'eshg.security.oauth2.resourceserver.*' properties instead, supporting multiple realms!\n\n"
        + "The following spring.security.oauth2.resourceserver properties were found: %n%s"
            .formatted(foundPropertiesString);
  }

  private AuthenticationManagerResolver<HttpServletRequest> authenticationManagerResolver() {
    final Map<String, AuthenticationManager> authenticationProviders =
        Stream.of(
                this.resourceServerProperties.getEmployeeJwt(),
                this.resourceServerProperties.getCitizenJwt())
            .collect(
                StreamUtil.toLinkedHashMap(
                    EshgJwt::getIssuerUri,
                    jwtProperties ->
                        authenticationProvider(
                                jwtProperties, jwtAuthenticationConverterForKeycloak())
                            ::authenticate));
    return new JwtIssuerAuthenticationManagerResolver(authenticationProviders::get);
  }

  private JwtAuthenticationProvider authenticationProvider(
      EshgJwt jwtProperties, JwtAuthenticationConverter authenticationConverter) {
    // see: OAuth2ResourceServerJwtConfiguration.jwtDecoderByJwkKeySetUri for reference
    JwtDecoder decoder = getDecoder(jwtProperties);
    JwtAuthenticationProvider provider = new JwtAuthenticationProvider(decoder);
    provider.setJwtAuthenticationConverter(authenticationConverter);
    return provider;
  }

  private NimbusJwtDecoder getDecoder(EshgJwt jwtProperties) {
    String issuerUri = jwtProperties.getIssuerUri();
    String jwkSetUri = jwtProperties.getJwkSetUri();
    log.info("Using jwkSetUri: {}", jwkSetUri);
    log.info("Using issuerUri: {}", issuerUri);

    NimbusJwtDecoder decoder =
        NimbusJwtDecoder.withJwkSetUri(jwkSetUri)
            .jwsAlgorithms(set -> jwsAlgorithms(set, jwtProperties))
            .build();

    OAuth2TokenValidator<Jwt> defaultValidator = JwtValidators.createDefaultWithIssuer(issuerUri);
    decoder.setJwtValidator(getValidators(defaultValidator));
    return decoder;
  }

  private OAuth2TokenValidator<Jwt> getValidators(OAuth2TokenValidator<Jwt> defaultValidator) {
    if (this.additionalJwtValidators.isEmpty()) {
      return defaultValidator;
    }
    List<OAuth2TokenValidator<Jwt>> validators = new ArrayList<>();
    validators.add(defaultValidator);
    validators.addAll(this.additionalJwtValidators);
    return new DelegatingOAuth2TokenValidator<>(validators);
  }

  private void jwsAlgorithms(Set<SignatureAlgorithm> signatureAlgorithms, EshgJwt jwtProperties) {
    for (String algorithm : jwtProperties.getJwsAlgorithms()) {
      signatureAlgorithms.add(SignatureAlgorithm.from(algorithm));
    }
  }

  // see
  // https://stackoverflow.com/questions/69331013/springboot-oauth2-with-keycloak-not-returning-mapped-roles-as-authorities
  private static JwtAuthenticationConverter jwtAuthenticationConverterForKeycloak() {
    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter =
        new JwtGrantedAuthoritiesConverter();
    jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName(KeycloakRole.CLAIM_NAME);
    jwtGrantedAuthoritiesConverter.setAuthorityPrefix(KeycloakRole.AUTHORITY_PREFIX);
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
    return jwtAuthenticationConverter;
  }
}
