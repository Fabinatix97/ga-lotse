/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.procedure.model.CreateInboxProcedureRequest;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.model.GetInboxProcedureResponse;
import de.eshg.lib.procedure.model.GetInboxProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresPaginationOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresResponse;
import de.eshg.lib.procedure.model.GetInboxProceduresSortOptions;
import de.eshg.lib.procedure.model.InboxProcedureDto;
import de.eshg.lib.procedure.model.InboxProcedureStatusDto;
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
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(ProcedureLibrary.INBOX_PROCEDURES_API)
public interface InboxProcedureApi {

  class QueryParameter {

    private QueryParameter() {}

    public static final String INBOX_PROCEDURE_TYPE = "inboxProcedureType";
    public static final String INCLUDE_UNTYPED = "includeUntyped";
    public static final String INBOX_PROCEDURE_STATUS = "inboxProcedureStatus";
    public static final String SORT_BY = "sortBy";
    public static final String SORT_ORDER = "sortOrder";
    public static final String PAGE_NUMBER = "pageNumber";
    public static final String PAGE_SIZE = "pageSize";

    public static final String DEFAULT_PAGE_SIZE = "25";
    public static final Integer DEFAULT_PAGE_SIZE_VALUE = Integer.valueOf(DEFAULT_PAGE_SIZE);
  }

  @PostExchange(contentType = MULTIPART_FORM_DATA_VALUE)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Add inbox procedure",
      description =
          """
         Creates an inbox procedure with an optional file upload.

                Permitted file formats:
                 - Image formats: jpeg, png
                 - PDF formats: pdf/a
                 - Mail formats: eml""")
  InboxProcedureDto addInboxProcedure(
      @RequestPart(name = "createInboxProcedureRequest") @Valid
          CreateInboxProcedureRequest createInboxProcedureRequest,
      @RequestPart(name = "file", required = false) MultipartFile file,
      @RequestPart(name = "fileMetaData", required = false) @Valid FileMetaDataDto fileMetaData)
      throws IOException;

  @GetExchange("/{inboxProcedureId}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get inbox procedure with detailed information")
  GetInboxProcedureResponse getInboxProcedure(
      @PathVariable(name = "inboxProcedureId") UUID inboxProcedureId);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get inbox procedures",
      description =
          """
          Get all inbox procedures with filter, sort, and pagination options
          """)
  GetInboxProceduresResponse getInboxProcedures(
      @InlineParameterObject @ParameterObject @Valid GetInboxProceduresFilterOptions filterOptions,
      @InlineParameterObject @ParameterObject @Valid GetInboxProceduresSortOptions sortOptions,
      @InlineParameterObject @ParameterObject @Valid
          GetInboxProceduresPaginationOptions paginationOptions);

  @PutExchange("/{inboxProcedureId}/inbox-procedure-status")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Update status of inbox procedure")
  InboxProcedureDto updateInboxProcedureStatus(
      @PathVariable(name = "inboxProcedureId") UUID inboxProcedureId,
      @RequestBody InboxProcedureStatusDto inboxProcedureStatus);
}
