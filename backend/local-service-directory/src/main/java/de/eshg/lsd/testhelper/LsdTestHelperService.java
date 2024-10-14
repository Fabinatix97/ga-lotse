/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.testhelper;

import de.eshg.lib.keycloak.UsernamePassword;
import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import de.eshg.libservicedirectoryadminapi.api.testhelper.ServiceDirectoryTestHelperApi;
import de.eshg.lsd.keycloak.KeycloakProvisioning;
import de.eshg.lsd.keycloak.properties.LsdInternalKeycloakProperties;
import de.eshg.testhelper.AccessToken;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperClock;
import de.eshg.testhelper.TestHelperService;
import de.eshg.testhelper.api.DefaultPopulationResponse;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.InterceptionType;
import de.eshg.testhelper.interception.TestHelperInterceptionRequestFilter;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.Period;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import org.apache.commons.lang3.NotImplementedException;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.AccessTokenResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@ConditionalOnTestHelperEnabled
@Service
public class LsdTestHelperService implements TestHelperService {

  private static final Logger log = LoggerFactory.getLogger(LsdTestHelperService.class);
  private final KeycloakProvisioning keycloakProvisioning;
  private final LsdInternalKeycloakProperties lsdInternalKeycloakProperties;
  private final ServiceDirectoryTestHelperApi serviceDirectoryTestHelperClient;
  private final TestRequestInterceptor testRequestInterceptor;
  private final Clock clock;

  private final Map<UsernamePassword, AccessToken> cachedAccessTokens = new ConcurrentHashMap<>();

  public LsdTestHelperService(
      KeycloakProvisioning keycloakProvisioning,
      LsdInternalKeycloakProperties lsdInternalKeycloakProperties,
      ServiceDirectoryTestHelperApi serviceDirectoryTestHelperClient,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    log.warn("Creating {}", getClass().getSimpleName());
    this.serviceDirectoryTestHelperClient = serviceDirectoryTestHelperClient;
    this.testRequestInterceptor = testRequestInterceptor;
    this.clock = clock;
    this.keycloakProvisioning = keycloakProvisioning;
    this.lsdInternalKeycloakProperties = lsdInternalKeycloakProperties;
  }

  @Override
  public Instant reset() throws Exception {
    cachedAccessTokens.clear();
    serviceDirectoryTestHelperClient.reset();

    keycloakProvisioning.createOrUpdateRealm();
    keycloakProvisioning.deleteUsers();
    keycloakProvisioning.addDummyUser();

    resetInterceptions();
    withTestClock(TestHelperClock::reset);
    return Instant.now(clock);
  }

  void withTestClock(Consumer<TestHelperClock> testClockConsumer) {
    if (clock instanceof TestHelperClock testClock) {
      testClockConsumer.accept(testClock);
    } else {
      log.warn("Test clock is disabled");
    }
  }

  @Override
  public void interceptNextRequest(
      InterceptionType type, TestHelperInterceptionRequestFilter filter) {
    testRequestInterceptor.interceptNextRequest(type, filter);
  }

  @Override
  public long addBarrier(TestHelperInterceptionRequestFilter filter) {
    return testRequestInterceptor.addBarrier(filter);
  }

  @Override
  public void resetInterceptions() {
    testRequestInterceptor.reset();
  }

  @Override
  public void awaitAndRemoveBarrier(long barrierId, Long timeoutInMillis) {
    testRequestInterceptor.awaitAndRemoveBarrier(barrierId, timeoutInMillis);
  }

  @Override
  public void waitUntilSomeoneIsAwaitingTheCyclicBarrier(long barrierId) {
    testRequestInterceptor.waitUntilSomeoneIsAwaitingTheCyclicBarrier(barrierId);
  }

  @Override
  public Instant windClockForward(Period period, Duration duration) {
    withTestClock(testHelperClock -> testHelperClock.windForward(period, duration));
    return Instant.now(clock);
  }

  @Override
  public void setClock(Instant newInstant) {
    withTestClock(testHelperClock -> testHelperClock.changeToInstant(newInstant));
  }

  @Override
  public DefaultPopulationResponse populateDefaults() {
    throw new NotImplementedException(
        "Default test data population has not been implemented for the local-service-directory yet!");
  }

  public AccessToken login(UsernamePassword usernamePassword) {
    // Logins take ~100ms on a T14 (Gen3) with an Intel i7 1270P.
    // So caching the tokens is important for overall test performance.
    return cachedAccessTokens.computeIfAbsent(usernamePassword, this::loginUncached);
  }

  private AccessToken loginUncached(UsernamePassword usernamePassword) {
    try (Keycloak keycloak =
        KeycloakBuilder.builder()
            .serverUrl(lsdInternalKeycloakProperties.url())
            .grantType(OAuth2Constants.PASSWORD)
            .realm(keycloakProvisioning.getRealm())
            .scope(OAuth2Constants.SCOPE_OPENID)
            .clientId(keycloakProvisioning.getClientId())
            .clientSecret(keycloakProvisioning.getClientSecret())
            .username(usernamePassword.username())
            .password(usernamePassword.password())
            .build()) {
      AccessTokenResponse accessToken = keycloak.tokenManager().getAccessToken();
      Assert.isTrue(
          accessToken.getTokenType().equals("Bearer"),
          () -> "Access token of type 'Bearer' expected but got: " + accessToken.getTokenType());
      return new AccessToken(
          accessToken.getToken(), Instant.now().plusSeconds(accessToken.getExpiresIn()));
    }
  }

  public CommitResponseDto commitStaged() {
    return serviceDirectoryTestHelperClient.commitStaged();
  }
}
