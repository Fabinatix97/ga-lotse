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
import de.eshg.testhelper.interception.AddBarrierTestHelperResponse;
import de.eshg.testhelper.interception.InsertRequestInterceptionTestHelperRequest;
import de.eshg.testhelper.interception.TestHelperInterceptionRequestFilter;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(TestHelperApi.BASE_URL)
public interface TestHelperApi {

  String BASE_URL = "/test-helper";

  @PostExchange("/reset")
  TestHelperClockUpdateResponse reset() throws Exception;

  @GetExchange("/database-connection-details")
  @Hidden(/* There is currently no need to expose this in the OpenAPI spec */ )
  TestHelperDatabaseConnectionDetailsResponse getDatabaseConnectionDetails();

  @PostExchange("/database-from-snapshot")
  @Hidden(/* There is currently no need to expose this in the OpenAPI spec */ )
  void restoreDatabaseSnapshot(@RequestBody String sql) throws Exception;

  @PostExchange("/population")
  DefaultPopulationResponse populateDefaults();

  @PostExchange(value = "/request-interceptor")
  void interceptNextRequest(@Valid @RequestBody InsertRequestInterceptionTestHelperRequest request);

  @PostExchange(value = "/request-interceptor/barriers")
  AddBarrierTestHelperResponse addBarrier(
      @Valid @RequestBody TestHelperInterceptionRequestFilter filter);

  @PostExchange(value = "/request-interceptor/barriers/{barrierId}/await")
  void awaitBarrier(
      @PathVariable("barrierId") long barrierId,
      @RequestParam(value = "timeoutInMillis", required = false) @Min(0) Long timeoutInMillis);

  @PostExchange("/request-interceptor/reset")
  void resetInterceptionsAndBarriers();

  @PatchExchange(value = "/wind-clock")
  TestHelperClockUpdateResponse windClockForward(
      @Valid @RequestBody TestHelperClockWindForwardRequest request);

  @PatchExchange(value = "/set-clock")
  TestHelperClockUpdateResponse setClock(@Valid @RequestBody TestHelperClockSetRequest request);
}
