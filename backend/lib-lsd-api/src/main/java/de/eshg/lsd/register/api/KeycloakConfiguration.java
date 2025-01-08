/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import de.eshg.lsd.register.api.LsdActorApiConfiguration.BearerAuthTokenSupplier;
import jakarta.ws.rs.WebApplicationException;
import java.io.Serial;
import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.util.Assert;

@AutoConfiguration
@EnableConfigurationProperties(LsdKeycloakProperties.class)
public class KeycloakConfiguration {

  private static final Duration minimalTokenLifeTime = Duration.ofSeconds(30);

  @Bean
  @ConditionalOnProperty("eshg.lsd-keycloak.actor.user")
  public Keycloak keycloak(LsdKeycloakProperties lsdKeycloakProperties) {
    return KeycloakBuilder.builder()
        .serverUrl(lsdKeycloakProperties.client().url())
        .realm(lsdKeycloakProperties.client().realm())
        .grantType(OAuth2Constants.PASSWORD)
        .clientId(lsdKeycloakProperties.client().clientId())
        .clientSecret(lsdKeycloakProperties.client().clientSecret())
        .username(lsdKeycloakProperties.actor().user())
        .password(lsdKeycloakProperties.actor().password())
        .build();
  }

  @Bean
  @ConditionalOnMissingBean
  @ConditionalOnBean(Keycloak.class)
  public BearerAuthTokenSupplier cachingTokenSupplier(Keycloak keycloak) {
    AtomicReference<TokenCacheItem> cache = new AtomicReference<>();
    return () -> {
      TokenCacheItem cacheItem = cache.get();
      if (tokenLifeTimeAcceptable(cacheItem)) {
        return cacheItem.token();
      }

      TokenCacheItem newCacheItem = fetchNewToken(keycloak);
      cache.set(newCacheItem);
      return newCacheItem.token();
    };
  }

  private static TokenCacheItem fetchNewToken(Keycloak keycloak) {
    AccessTokenResponse response;
    try {
      response = keycloak.tokenManager().getAccessToken();
    } catch (WebApplicationException e) {
      throw new KeycloakException("Keycloak get access token request failed", e);
    }
    Assert.isTrue(
        "Bearer".equals(response.getTokenType()),
        "Unexpected token type '" + response.getTokenType() + "', expected 'Bearer'");
    String token = Objects.requireNonNull(response.getToken());
    Instant expiryDate =
        Instant.now().plusSeconds(response.getExpiresIn()).minus(minimalTokenLifeTime);
    TokenCacheItem newCacheItem = new TokenCacheItem(token, expiryDate);
    Assert.isTrue(
        tokenLifeTimeAcceptable(newCacheItem),
        "Token expires in less than " + minimalTokenLifeTime);
    return newCacheItem;
  }

  private static boolean tokenLifeTimeAcceptable(TokenCacheItem tokenCacheItem) {
    if (tokenCacheItem == null) return false;
    return Instant.now().isBefore(tokenCacheItem.expiryDate());
  }

  private record TokenCacheItem(String token, Instant expiryDate) {}

  public static class KeycloakException extends RuntimeException {
    @Serial private static final long serialVersionUID = 0;

    private KeycloakException(String message, Throwable cause) {
      super(message, cause);
    }
  }
}
