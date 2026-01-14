/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.procedure.model.GetDetailedProcedureResponse;
import de.eshg.lib.procedure.model.GetProcedureApprovalRequestsResponse;
import de.eshg.lib.procedure.model.GetProcedureFileDetailsResponse;
import de.eshg.lib.procedure.model.GetProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetProceduresPaginationOptions;
import de.eshg.lib.procedure.model.GetProceduresResponse;
import de.eshg.lib.procedure.model.GetProceduresSortOptionsDto;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

public interface ProcedureApi extends BusinessModuleProcedureApi, ProcedureMetricsApi {

  class QueryParameter {

    private QueryParameter() {}

    public static final String PROCEDURE_TYPE = "procedureType";
    public static final String PROCEDURE_STATUS = "procedureStatus";
    public static final String ASSIGNED_TO_ID = "assignedToId";
    public static final String SORT_BY = "sortBy";
    public static final String SORT_ORDER = "sortOrder";
    public static final String PAGE_NUMBER = "pageNumber";
    public static final String PAGE_SIZE = "pageSize";
  }

  @GetExchange(ProcedureLibrary.PROCEDURES_API)
  @Operation(
      summary = "Get recent procedures for user",
      description =
          """
          GET operation for retrieving basic information of procedures for the procedure overview.
          """)
  @ApiResponse(responseCode = "200", description = "the users recent procedures")
  GetProceduresResponse getProcedures(
      @InlineParameterObject @ParameterObject @Valid GetProceduresFilterOptions filterOptions,
      @InlineParameterObject @ParameterObject @Valid GetProceduresSortOptionsDto sortOptions,
      @InlineParameterObject @ParameterObject @Valid
          GetProceduresPaginationOptions paginationOptions);

  @GetExchange(ProcedureLibrary.PROCEDURES_API + "/search")
  GetProceduresResponse searchProcedures(@RequestParam("query") String query);

  @GetExchange(ProcedureLibrary.PROCEDURES_API + "/{id}")
  @ApiResponse(responseCode = "200", description = "a single procedure with details")
  @Operation(summary = "Get a single procedure with details")
  GetDetailedProcedureResponse getDetailedProcedure(@PathVariable("id") UUID id);

  @GetExchange(ProcedureLibrary.PROCEDURES_API + "/{id}/files")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get relevant procedure files",
      description =
          """
          This returns all relevant (highest version per keydocument type and non-deleted) files sorted by descending creation date.
          That is:
           * if an progress entry has a keydocument type set, then its files are only returned if it also has the highest keydocument version of the respective key document type.
           * if an progress entry does not have a keydocument type, then its files are always returned.
          """)
  GetProcedureFileDetailsResponse getProcedureFileDetails(@PathVariable("id") UUID id);

  @ApiResponse(responseCode = "200")
  @GetExchange(ProcedureLibrary.PROCEDURES_API + "/{id}/approval-requests")
  @Operation(summary = "Get all approval requests related to this procedure")
  GetProcedureApprovalRequestsResponse getApprovalRequests(@PathVariable("id") UUID procedureId);
}
