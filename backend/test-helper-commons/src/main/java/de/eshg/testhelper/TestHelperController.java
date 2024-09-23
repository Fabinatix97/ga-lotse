/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.testhelper.api.DefaultPopulationResponse;
import de.eshg.testhelper.clock.TestHelperClockSetRequest;
import de.eshg.testhelper.clock.TestHelperClockUpdateResponse;
import de.eshg.testhelper.clock.TestHelperClockWindForwardRequest;
import de.eshg.testhelper.interception.AddBarrierTestHelperResponse;
import de.eshg.testhelper.interception.InsertRequestInterceptionTestHelperRequest;
import de.eshg.testhelper.interception.TestHelperInterceptionRequestFilter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.sql.SQLException;
import java.time.Duration;
import java.time.Instant;
import java.time.Period;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
@ConditionalOnMissingBean(TestHelperController.class)
@Tag(name = "TestHelper")
public class TestHelperController implements TestHelperApi {

  private final TestHelperService testHelperService;

  public TestHelperController(TestHelperService testHelperService) {
    this.testHelperService = testHelperService;
  }

  @Override
  public TestHelperClockUpdateResponse reset() throws SQLException {
    Instant instant = testHelperService.reset();
    return new TestHelperClockUpdateResponse(instant);
  }

  @Override
  public DefaultPopulationResponse populateDefaults() {
    return testHelperService.populateDefaults();
  }

  @Override
  public void interceptNextRequest(InsertRequestInterceptionTestHelperRequest request) {
    testHelperService.interceptNextRequest(request.type(), request.filter());
  }

  @Override
  public AddBarrierTestHelperResponse addBarrier(TestHelperInterceptionRequestFilter filter) {
    long barrierId = testHelperService.addBarrier(filter);
    return new AddBarrierTestHelperResponse(barrierId);
  }

  @Override
  public void awaitBarrier(long barrierId, Long timeoutInMillis) {
    testHelperService.awaitAndRemoveBarrier(barrierId, timeoutInMillis);
  }

  @Override
  public void resetInterceptionsAndBarriers() {
    testHelperService.resetInterceptions();
  }

  @Override
  public TestHelperClockUpdateResponse windClockForward(TestHelperClockWindForwardRequest request) {
    Period period = request.toPeriod();
    Duration duration = request.toDuration();
    Instant instant = testHelperService.windClockForward(period, duration);
    return new TestHelperClockUpdateResponse(instant);
  }

  @Override
  public TestHelperClockUpdateResponse setClock(TestHelperClockSetRequest request) {
    Instant newInstant = request != null ? request.newInstant() : Instant.now();
    testHelperService.setClock(newInstant);
    return new TestHelperClockUpdateResponse(newInstant);
  }
}
