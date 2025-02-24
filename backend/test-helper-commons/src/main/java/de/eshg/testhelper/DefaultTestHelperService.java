/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.testhelper.api.DefaultPopulationResponse;
import de.eshg.testhelper.api.TestHelperDatabaseConnectionDetailsResponse;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.InterceptionType;
import de.eshg.testhelper.interception.TestHelperInterceptionRequestFilter;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.Period;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.jdbc.JdbcConnectionDetails;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnTestHelperEnabled
@ConditionalOnMissingBean(TestHelperService.class)
public class DefaultTestHelperService implements TestHelperWithDatabaseService {

  private static final Logger log = LoggerFactory.getLogger(DefaultTestHelperService.class);

  private final DatabaseResetHelper databaseResetHelper;
  private final TestRequestInterceptor testRequestInterceptor;
  protected final Clock clock;

  protected final List<BasePopulator<?>> populators;
  protected final List<ResettableProperties> resettableProperties;
  private final List<TestHelperServiceResetAction> resetActions;

  private final Map<ResettableProperties, String> initialResettablePropertiesSnapshots;
  protected final EnvironmentConfig environmentConfig;

  protected DefaultTestHelperService(
      @Autowired(required = false) DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      List<TestHelperServiceResetAction> resetActions,
      EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    log.warn("Creating {}", getClass().getSimpleName());
    this.environmentConfig = environmentConfig;
    this.databaseResetHelper = databaseResetHelper;
    this.testRequestInterceptor = testRequestInterceptor;
    this.clock = clock;
    this.populators = populators;
    this.resettableProperties = resettableProperties;
    this.resetActions = assertOrdered(resetActions);
    this.initialResettablePropertiesSnapshots =
        resettableProperties.stream()
            .collect(Collectors.toMap(Function.identity(), SnapshotUtil::createSnapshot));
  }

  @Override
  public Instant reset() throws Exception {
    environmentConfig.assertIsNotProduction();
    resetResettableProperties();
    for (TestHelperServiceResetAction resetAction : resetActions) {
      resetAction.reset();
    }
    return Instant.now(clock);
  }

  public String describeResetHelperSetup() {
    if (resetActions.isEmpty()) {
      return "TestHelperServiceResetAction beans: none";
    } else {
      return "TestHelperServiceResetAction beans:\n"
          + resetActions.stream()
              .map(TestHelperServiceResetAction::getClass)
              .map(
                  clazz ->
                      "%s (@Order(%d))"
                          .formatted(clazz.getName(), clazz.getAnnotation(Order.class).value()))
              .collect(Collectors.joining("\n"))
              .indent(4);
    }
  }

  @Override
  public void restoreDatabaseSnapshot(String databaseSnapshotSql) throws Exception {
    environmentConfig.assertIsNotProduction();
    databaseResetHelper.restoreDatabaseSnapshot(databaseSnapshotSql);
  }

  @Override
  public TestHelperDatabaseConnectionDetailsResponse getDatabaseConnectionDetails() {
    environmentConfig.assertIsNotProduction();
    JdbcConnectionDetails jdbcConnectionDetails = databaseResetHelper.getJdbcConnectionDetails();
    return new TestHelperDatabaseConnectionDetailsResponse(
        jdbcConnectionDetails.getJdbcUrl(),
        jdbcConnectionDetails.getUsername(),
        jdbcConnectionDetails.getPassword());
  }

  void withTestClock(Consumer<TestHelperClock> testClockConsumer) {
    if (clock instanceof TestHelperClock testClock) {
      testClockConsumer.accept(testClock);
    } else {
      log.warn("Test clock is disabled");
    }
  }

  public void resetResettableProperties() {
    environmentConfig.assertIsNotProduction();
    for (ResettableProperties resettableProperties : resettableProperties) {
      resetProperties(resettableProperties);
    }
  }

  public void resetProperties(ResettableProperties resettableProperties) {
    String resettablePropertiesSnapshot =
        initialResettablePropertiesSnapshots.get(resettableProperties);
    SnapshotUtil.restoreSnapshot(resettablePropertiesSnapshot, resettableProperties);
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
    environmentConfig.assertIsNotProduction();
    List<DefaultPopulationResponse.Population> populations =
        populators.stream()
            .map(
                populator -> {
                  int numberOfEntitiesToPopulate = populator.getDefaultNumberOfEntitiesToPopulate();
                  ListWithTotalNumber<?> populationResult =
                      populator.populate(numberOfEntitiesToPopulate);
                  return new DefaultPopulationResponse.Population(
                      populator.getClass().getSimpleName(),
                      populationResult.entities().size(),
                      populationResult.totalNumberOfElements());
                })
            .toList();
    return new DefaultPopulationResponse(populations);
  }

  private List<TestHelperServiceResetAction> assertOrdered(
      List<TestHelperServiceResetAction> actions) {
    Set<Integer> orders = new HashSet<>();
    actions.stream()
        .map(TestHelperServiceResetAction::getClass)
        .forEach(
            actionClazz -> {
              Order orderAnnotation = actionClazz.getAnnotation(Order.class);
              if (orderAnnotation == null) {
                throw new IllegalArgumentException(
                    "Missing @Order for resetAction: %s".formatted(actionClazz.getName()));
              }
              if (!orders.add(orderAnnotation.value())) {
                throw new IllegalArgumentException(
                    "Duplicate @Order value %d for resetAction: %s"
                        .formatted(orderAnnotation.value(), actionClazz.getName()));
              }
            });
    return actions;
  }
}
