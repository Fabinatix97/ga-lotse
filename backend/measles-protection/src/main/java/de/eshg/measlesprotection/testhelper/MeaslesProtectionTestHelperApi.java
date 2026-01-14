/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import de.eshg.testhelper.TestHelperApi;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

public interface MeaslesProtectionTestHelperApi extends TestHelperApi {

  @PostExchange("/polytune-mock")
  @Operation(
      summary = "Initialize the polytune mock",
      description =
          "The polytune mock can be initialized with a map of simulated vaccination "
              + "check results by fileStateIds. Also, a calculation duration can be "
              + "set which then applies for *all* simulated calculations. If the mock "
              + "is initialized with an empty request, a default behavior (no vaccination "
              + "results, zero calculation time) is assumed. If the mock is not initialized "
              + "at all, every subsequent call to the mocked API will fail with an "
              + "exception.")
  void initializePolytuneMock(PolytuneMockIntitializeRequest request);

  @GetExchange("/polytune-mock")
  @Operation(
      summary = "Get all polytune mock interactions recorded during the current test",
      description =
          "The interactions (and also the mock itself) are automatically reset after "
              + "every test.")
  GetPolytuneMockInteractionsResponse getPolytuneMockInteractions();

  @PostExchange("/polytune-mock/error")
  @Operation(
      summary = "Simulate a polytune error",
      description =
          "Defines an error which will be returned during the next call to the mocked "
              + "polytune API. Any subsequent API call after the next one will again "
              + "work as normal (without the simulated error).")
  void simulatePolytuneMockError(PolytuneMockSimulateErrorRequest request);
}
