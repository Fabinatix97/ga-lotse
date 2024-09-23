/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.foureyes.model.ApprovalRequestDto;
import de.eshg.lib.foureyes.model.CreateApprovalRequestRequest;
import de.eshg.lib.procedure.model.CreateManualProgressEntryRequest;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.model.GetManualProgressEntryHistoryResponse;
import de.eshg.lib.procedure.model.GetProgressEntriesFilterOptions;
import de.eshg.lib.procedure.model.GetProgressEntriesResponse;
import de.eshg.lib.procedure.model.GetProgressEntriesSortOptions;
import de.eshg.lib.procedure.model.GetProgressEntryPaginationOptions;
import de.eshg.lib.procedure.model.GetProgressEntryResponse;
import de.eshg.lib.procedure.model.ManualProgressEntryDto;
import de.eshg.lib.procedure.model.PatchManualProgressEntryRequest;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(ProcedureLibrary.PROGRESS_ENTRIES_API)
public interface ProgressEntryApi {

  class QueryParameter {

    private QueryParameter() {}

    public static final String PROGRESS_ENTRY_TYPE = "progressEntryType";
    public static final String PROGRESS_ENTRY_CLASS = "progressEntryClass";
    public static final String INITIATED_BY = "initiatedBy";
    public static final String TRIGGER_TYPE = "triggerType";
    public static final String SORT_BY = "sortBy";
    public static final String SORT_ORDER = "sortOrder";
    public static final String PAGE_SIZE = "pageSize";
    public static final String PAGE_NUMBER = "pageNumber";
  }

  @Operation(summary = "Get list of procedure's progress entries")
  @ApiResponse(responseCode = "200")
  @GetExchange
  GetProgressEntriesResponse getProgressEntries(
      @PathVariable("procedureId") UUID procedureId,
      @InlineParameterObject @ParameterObject @Valid GetProgressEntriesFilterOptions filterOptions,
      @InlineParameterObject @ParameterObject @Valid GetProgressEntriesSortOptions sortOptions,
      @InlineParameterObject @ParameterObject @Valid
          GetProgressEntryPaginationOptions paginationOptions);

  @Operation(
      summary = "Create a manual progress entry",
      description =
          """
             Creates a manual progress entry with an optional file upload.

                    Permitted file formats:
                     - Image formats: jpeg, png
                     - PDF formats: pdf/a
                     - Mail formats: eml""")
  @ApiResponse(responseCode = "200")
  @PostExchange(contentType = MULTIPART_FORM_DATA_VALUE)
  ManualProgressEntryDto addProgressEntry(
      @PathVariable("procedureId") UUID procedureId,
      @RequestPart(name = "createManualProgressEntryRequest") @Valid
          CreateManualProgressEntryRequest createManualProgressEntryRequest,
      @RequestPart(name = "file", required = false) MultipartFile file,
      @RequestPart(name = "fileMetaData", required = false) @Valid FileMetaDataDto fileMetaData)
      throws IOException;

  @Operation(summary = "Remove a manual progress entry")
  @ApiResponse(responseCode = "200")
  @DeleteExchange("/{progressEntryId}")
  void removeProgressEntry(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("progressEntryId") UUID progressEntryId);

  @Operation(summary = "Get a progress entry")
  @ApiResponse(responseCode = "200")
  @GetExchange("/{progressEntryId}")
  GetProgressEntryResponse getProgressEntry(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("progressEntryId") UUID progressEntryId);

  @Operation(summary = "Request deletion of a manual progress entry")
  @ApiResponse(responseCode = "200")
  @PostExchange("/{progressEntryId}/deletion-request")
  ApprovalRequestDto requestProgressEntryDeletion(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("progressEntryId") UUID progressEntryId,
      @Valid @RequestBody CreateApprovalRequestRequest createApprovalRequestRequest);

  @Operation(summary = "Modify a manual progress entry")
  @ApiResponse(responseCode = "200")
  @PatchExchange("/{progressEntryId}")
  ManualProgressEntryDto patchProgressEntry(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("progressEntryId") UUID progressEntryId,
      @Valid @RequestBody PatchManualProgressEntryRequest patchManualProgressEntryRequest);

  @Operation(summary = "Get the history of a manual progress entry")
  @ApiResponse(responseCode = "200")
  @GetExchange("/{progressEntryId}/history")
  GetManualProgressEntryHistoryResponse getManualProgressEntryHistory(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("progressEntryId") UUID progressEntryId);
}
