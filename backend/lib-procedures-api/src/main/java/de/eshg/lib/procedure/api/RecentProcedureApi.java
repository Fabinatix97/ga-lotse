/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import static de.eshg.lib.procedure.api.RecentProcedureApi.QueryParameter.*;

import de.eshg.api.commons.CanBeLogged;
import de.eshg.lib.procedure.model.GetRecentProceduresResponse;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Set;
import java.util.UUID;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

public interface RecentProcedureApi {
  String RECENT_PROCEDURES_API_PATH = ProcedureLibrary.PROCEDURES_API + "/recent";
  String SELF_RECENT_PROCEDURES_API_PATH = RECENT_PROCEDURES_API_PATH + "/self";

  class QueryParameter {

    private QueryParameter() {}

    public static final String USER_ID = "userId";
    public static final String PROCEDURE_TYPE = "procedureType";
    public static final String PROCEDURE_STATUS = "procedureStatus";
    public static final String LIMIT = "limit";
  }

  @GetExchange(SELF_RECENT_PROCEDURES_API_PATH)
  @ApiResponse(responseCode = "200", description = "the current users recent procedures")
  @Operation(summary = "Get recent procedures for the current user")
  GetRecentProceduresResponse getSelfRecentProcedures(
      @CanBeLogged @RequestParam(name = PROCEDURE_TYPE, required = false)
          Set<ProcedureTypeDto> procedureTypes,
      @CanBeLogged @RequestParam(name = PROCEDURE_STATUS, required = false)
          Set<ProcedureStatusDto> procedureStatus,
      @CanBeLogged
          @RequestParam(name = LIMIT, required = false, defaultValue = "50")
          @Min(1)
          @Max(200)
          Integer limit);

  @GetExchange(RECENT_PROCEDURES_API_PATH)
  @ApiResponse(responseCode = "200", description = "the users recent procedures")
  @Operation(summary = "Get recent procedures for user")
  GetRecentProceduresResponse getRecentProcedures(
      @RequestParam(name = USER_ID) UUID userId,
      @CanBeLogged @RequestParam(name = PROCEDURE_TYPE, required = false)
          Set<ProcedureTypeDto> procedureTypes,
      @CanBeLogged @RequestParam(name = PROCEDURE_STATUS, required = false)
          Set<ProcedureStatusDto> procedureStatus,
      @CanBeLogged
          @RequestParam(name = LIMIT, required = false, defaultValue = "50")
          @Min(1)
          @Max(200)
          Integer limit);
}
