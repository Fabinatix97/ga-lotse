/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.procedure.model.BulkUpdateProceduresArchivingRelevanceRequest;
import de.eshg.lib.procedure.model.BulkUpdateProceduresArchivingRelevanceResponse;
import de.eshg.lib.procedure.model.ExportArchivingRelevantProceduresRequest;
import de.eshg.lib.procedure.model.GetArchivableProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetArchivableProceduresResponse;
import de.eshg.lib.procedure.model.GetArchivableProceduresSortOptions;
import de.eshg.lib.procedure.model.GetArchivingConfigurationResponse;
import de.eshg.lib.procedure.model.GetProceduresPaginationOptions;
import de.eshg.lib.procedure.model.GetRelevantArchivableProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetRelevantArchivableProceduresResponse;
import de.eshg.lib.procedure.model.GetRelevantArchivableProceduresSortOptions;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(ProcedureLibrary.ARCHIVING_API)
public interface ArchivingApi {

  class QueryParameter {

    private QueryParameter() {}

    public static final String PROCEDURE_TYPE = "procedureType";
    public static final String CLOSED_AT_DAY = "closedAtDay";
    public static final String DEFAULT_ARCHIVING_RELEVANCE = "defaultArchivingRelevance";
    public static final String EXPORTED = "exported";
    public static final String SORT_BY = "sortBy";
    public static final String SORT_ORDER = "sortOrder";
  }

  @GetExchange("/procedures")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get archivable procedures")
  GetArchivableProceduresResponse getArchivableProcedures(
      @InlineParameterObject @ParameterObject @Valid
          GetArchivableProceduresFilterOptions filterOptions,
      @InlineParameterObject @ParameterObject @Valid GetArchivableProceduresSortOptions sortOptions,
      @InlineParameterObject @ParameterObject @Valid
          GetProceduresPaginationOptions paginationOptions);

  @GetExchange("/procedures/{procedureId}")
  @ApiResponse(
      responseCode = "200",
      content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE))
  @Operation(summary = "Get archivable procedure")
  ResponseEntity<Resource> downloadArchivableProcedure(
      @PathVariable(name = "procedureId") UUID procedureId);

  @PostExchange("/procedures/bulk-update-archiving-relevance")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Bulk update procedures archiving relevance")
  BulkUpdateProceduresArchivingRelevanceResponse bulkUpdateProceduresArchivingRelevance(
      @Valid @RequestBody BulkUpdateProceduresArchivingRelevanceRequest request);

  @GetExchange("/relevant-procedures")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get relevant archivable procedures")
  GetRelevantArchivableProceduresResponse getRelevantArchivableProcedures(
      @InlineParameterObject @ParameterObject @Valid
          GetRelevantArchivableProceduresFilterOptions filterOptions,
      @InlineParameterObject @ParameterObject @Valid
          GetRelevantArchivableProceduresSortOptions sortOptions,
      @InlineParameterObject @ParameterObject @Valid
          GetProceduresPaginationOptions paginationOptions);

  @PostExchange("/relevant-procedures/export")
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
              schema = @Schema(format = "binary")))
  ResponseEntity<byte[]> exportRelevantProcedures(
      @Valid @RequestBody ExportArchivingRelevantProceduresRequest request) throws IOException;

  @GetExchange("/config")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get archiving configuration")
  GetArchivingConfigurationResponse getArchivingConfiguration();
}
