/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.testhelper.api.DefaultPopulationResponse;
import de.eshg.testhelper.api.TestHelperDatabaseConnectionDetailsResponse;
import de.eshg.testhelper.clock.TestHelperClockSetRequest;
import de.eshg.testhelper.clock.TestHelperClockUpdateResponse;
import de.eshg.testhelper.clock.TestHelperClockWindForwardRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.AddBarrierTestHelperResponse;
import de.eshg.testhelper.interception.InsertRequestInterceptionTestHelperRequest;
import de.eshg.testhelper.interception.TestHelperInterceptionRequestFilter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Duration;
import java.time.Instant;
import java.time.Period;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
@ConditionalOnBean(TestHelperWithDatabaseService.class)
@ConditionalOnMissingBean(TestHelperController.class)
@Tag(name = "TestHelper")
public class TestHelperController implements TestHelperApi {

  private static final Logger log = LoggerFactory.getLogger(TestHelperController.class);

  private final TestHelperWithDatabaseService testHelperWithDatabaseService;

  public TestHelperController(
      TestHelperWithDatabaseService testHelperWithDatabaseService,
      EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    log.warn("Creating {}", getClass().getSimpleName());
    this.testHelperWithDatabaseService = testHelperWithDatabaseService;
  }

  @Override
  public TestHelperClockUpdateResponse reset() throws Exception {
    Instant instant = testHelperWithDatabaseService.reset();
    return new TestHelperClockUpdateResponse(instant);
  }

  @Override
  public DefaultPopulationResponse populateDefaults() {
    return testHelperWithDatabaseService.populateDefaults();
  }

  @Override
  public TestHelperDatabaseConnectionDetailsResponse getDatabaseConnectionDetails() {
    return testHelperWithDatabaseService.getDatabaseConnectionDetails();
  }

  @Override
  public void restoreDatabaseSnapshot(String sql) throws Exception {
    testHelperWithDatabaseService.restoreDatabaseSnapshot(sql);
  }

  @Override
  public void interceptNextRequest(InsertRequestInterceptionTestHelperRequest request) {
    testHelperWithDatabaseService.interceptNextRequest(request.type(), request.filter());
  }

  @Override
  public AddBarrierTestHelperResponse addBarrier(TestHelperInterceptionRequestFilter filter) {
    long barrierId = testHelperWithDatabaseService.addBarrier(filter);
    return new AddBarrierTestHelperResponse(barrierId);
  }

  @Override
  public void awaitBarrier(long barrierId, Long timeoutInMillis) {
    testHelperWithDatabaseService.awaitAndRemoveBarrier(barrierId, timeoutInMillis);
  }

  @Override
  public void resetInterceptionsAndBarriers() {
    testHelperWithDatabaseService.resetInterceptions();
  }

  @Override
  public TestHelperClockUpdateResponse windClockForward(TestHelperClockWindForwardRequest request) {
    Period period = request.toPeriod();
    Duration duration = request.toDuration();
    Instant instant = testHelperWithDatabaseService.windClockForward(period, duration);
    return new TestHelperClockUpdateResponse(instant);
  }

  @Override
  public TestHelperClockUpdateResponse setClock(TestHelperClockSetRequest request) {
    Instant newInstant = request != null ? request.newInstant() : Instant.now();
    testHelperWithDatabaseService.setClock(newInstant);
    return new TestHelperClockUpdateResponse(newInstant);
  }
}
