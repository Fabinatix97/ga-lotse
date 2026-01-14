/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.lib.foureyes.model.ApprovalRequestDto;
import de.eshg.lib.foureyes.model.CreateApprovalRequestRequest;
import de.eshg.lib.procedure.model.AbstractFileDto;
import de.eshg.lib.procedure.model.GetMetaDataHistoryResponse;
import de.eshg.lib.procedure.model.MetaDataDto;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(ProcedureLibrary.FILES_API)
public interface FileApi {

  @GetExchange("/{fileId}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Retrieves the meta data of the specified file")
  AbstractFileDto getFile(@PathVariable("fileId") UUID fileId);

  @PutExchange("/{fileId}/meta-data")
  @ApiResponse(responseCode = "200", description = "Updated file")
  @Operation(summary = "Updates the meta data of the specified file")
  AbstractFileDto updateFileMetaData(
      @PathVariable("fileId") UUID fileId, @RequestBody @Valid MetaDataDto metaData);

  @GetExchange(value = "/{fileId}/meta-data/history")
  GetMetaDataHistoryResponse getMetaDataHistory(@PathVariable("fileId") UUID fileId);

  @DeleteExchange("/{fileId}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Soft deletes the specified file")
  void deleteFile(@PathVariable("fileId") UUID fileId);

  @PostExchange("/{fileId}/deletion-request")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Request deletion of a file entry")
  ApprovalRequestDto requestFileDeletion(
      @PathVariable("fileId") UUID fileId,
      @Valid @RequestBody CreateApprovalRequestRequest createApprovalRequestRequest);

  @GetExchange("/{fileId}/download")
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
              schema = @Schema(format = "binary")))
  ResponseEntity<byte[]> downloadFile(@PathVariable("fileId") UUID fileId);
}
