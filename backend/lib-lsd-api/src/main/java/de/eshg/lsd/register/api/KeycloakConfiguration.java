/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import de.eshg.lsd.register.api.KeycloakAccessTokenClient.oAuth2TokenResponse;
import de.eshg.lsd.register.api.LsdActorApiConfiguration.BearerAuthTokenSupplier;
import java.io.Serial;
import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.util.Assert;
import org.springframework.web.client.RestClient;

@AutoConfiguration
@EnableConfigurationProperties(LsdKeycloakProperties.class)
public class KeycloakConfiguration {

  private static final Duration minimalTokenLifeTime = Duration.ofSeconds(30);

  @Bean
  @ConditionalOnProperty("eshg.lsd-keycloak.actor.user")
  public KeycloakAccessTokenClient keycloak(
      RestClient.Builder restClientBuilder, LsdKeycloakProperties lsdKeycloakProperties) {
    return new KeycloakAccessTokenClient(restClientBuilder, lsdKeycloakProperties);
  }

  @Bean
  @ConditionalOnMissingBean
  @ConditionalOnBean(KeycloakAccessTokenClient.class)
  public BearerAuthTokenSupplier cachingTokenSupplier(KeycloakAccessTokenClient keycloak) {
    AtomicReference<TokenCacheItem> cache = new AtomicReference<>();
    return () -> {
      TokenCacheItem cacheItem = cache.get();
      if (tokenLifeTimeAcceptable(cacheItem)) {
        return cacheItem.token();
      }

      TokenCacheItem newCacheItem = buildCacheItem(keycloak.getAccessToken());
      cache.set(newCacheItem);
      return newCacheItem.token();
    };
  }

  private static TokenCacheItem buildCacheItem(oAuth2TokenResponse response) {
    Assert.isTrue(
        "Bearer".equals(response.tokenType()),
        "Unexpected token type '" + response.tokenType() + "', expected 'Bearer'");
    String token = Objects.requireNonNull(response.accessToken());
    Instant expiryDate =
        Instant.now().plusSeconds(response.expiresIn()).minus(minimalTokenLifeTime);
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
