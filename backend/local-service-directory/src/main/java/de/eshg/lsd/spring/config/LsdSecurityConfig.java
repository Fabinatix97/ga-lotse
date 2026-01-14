/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.spring.config;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.lsd.keycloak.PermissionRole;
import de.eshg.lsd.register.api.LsdActorApi;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.DefaultEshgSecurityConfig;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class LsdSecurityConfig {

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

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http, List<AuthorizationCustomizer> authorizationCustomizer) throws Exception {
    return http.authorizeHttpRequests(
            auth -> {
              authorizationCustomizer.forEach(c -> c.customize(auth));
              auth.requestMatchers(PUT, LsdActorApi.BASE_URL + "/**")
                  .hasRole(PermissionRole.LSD_WRITE_TECH_USER.getKeycloakName());

              auth.requestMatchers(POST, LsdActorApi.BASE_URL + "/**")
                  .hasRole(PermissionRole.LSD_WRITE_TECH_USER.getKeycloakName());

              auth.requestMatchers(
                      GET,
                      "/actuator/health",
                      "/actuator/health/liveness",
                      "/actuator/health/readiness")
                  .permitAll();
              auth.requestMatchers(GET, "/actuator/prometheus").permitAll();
            })
        .anonymous(AbstractHttpConfigurer::disable)
        .oauth2ResourceServer(
            auth2 ->
                auth2.jwt(
                    jwtConfigurer ->
                        jwtConfigurer.jwtAuthenticationConverter(
                            jwtAuthenticationConverterForKeycloak())))
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(customizer -> customizer.sessionCreationPolicy(STATELESS))
        .headers(DefaultEshgSecurityConfig::securityHeaders)
        .build();
  }
}
