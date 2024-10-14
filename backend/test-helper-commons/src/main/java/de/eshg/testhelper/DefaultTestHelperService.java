/*
 * Copyright 2024 cronn GmbH
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
import java.sql.SQLException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.jdbc.JdbcConnectionDetails;
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

  private final Map<ResettableProperties, String> initialResettablePropertiesSnapshots;
  protected final EnvironmentConfig environmentConfig;

  protected DefaultTestHelperService(
      @Autowired(required = false) DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    log.warn("Creating {}", getClass().getSimpleName());
    this.environmentConfig = environmentConfig;
    this.databaseResetHelper = databaseResetHelper;
    this.testRequestInterceptor = testRequestInterceptor;
    this.clock = clock;
    this.populators = populators;
    this.resettableProperties = resettableProperties;
    this.initialResettablePropertiesSnapshots =
        resettableProperties.stream()
            .collect(Collectors.toMap(Function.identity(), SnapshotUtil::createSnapshot));
  }

  @Override
  public Instant reset() throws Exception {
    environmentConfig.assertIsNotProduction();
    if (databaseResetHelper != null) {
      resetDatabase();
    }
    resetInterceptions();
    resetResettableProperties();
    withTestClock(TestHelperClock::reset);
    return Instant.now(clock);
  }

  private void resetDatabase() throws SQLException {
    databaseResetHelper.truncateAllTables(getTablesToExclude());
    databaseResetHelper.resetAllSequences();
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
      String resettablePropertiesSnapshot =
          initialResettablePropertiesSnapshots.get(resettableProperties);
      SnapshotUtil.restoreSnapshot(resettablePropertiesSnapshot, resettableProperties);
    }
  }

  protected String[] getTablesToExclude() {
    return new String[] {};
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
                  Integer numberOfEntitiesToPopulate =
                      populator.getDefaultNumberOfEntitiesToPopulate();
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
}
