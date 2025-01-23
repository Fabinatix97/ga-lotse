/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.eshg.lib.statistics.api.GetProcedureIdsRequest;
import de.eshg.lib.statistics.api.GetProcedureIdsResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(StatisticsProcedureReferenceApi.BASE_URL)
public interface StatisticsProcedureReferenceApi {
  String BASE_URL = BaseUrls.STATISTICS;

  @PostExchange("/procedure-ids")
  @Operation(summary = "Get procedure ids for procedure references")
  GetProcedureIdsResponse getProcedureIds(
      @Valid @RequestBody GetProcedureIdsRequest getProcedureIdsRequest);
}
