/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import static de.eshg.rest.service.security.config.BaseUrls.FileJockey.FILE_IO_API;

import de.eshg.filejockey.validation.ValidCorrelationId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(url = FileIoApi.BASE_URL)
public interface FileIoApi {

  String BASE_URL = FILE_IO_API;
  String FILE_IO_URL = "/{equipmentSelector}/{correlationId}";
  String FILE_IO_INPUT_URL = "/{equipmentSelector}/{correlationId}/input";
  String FILE_IO_OUTPUT_URL = "/{equipmentSelector}/{correlationId}/output";

  @PutExchange(value = FILE_IO_INPUT_URL, contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE)
  @Operation(
      summary =
          "Upload input file for given equipment selector and correlation ID. "
              + "Tolerates repeated calls with the same content.")
  @ApiResponse(responseCode = "200", description = "File uploaded")
  @ApiResponse(responseCode = "429", description = "Too many requests")
  ResponseEntity<Void> putInputFile(
      @PathVariable("equipmentSelector") @NotBlank String equipmentSelector,
      @PathVariable("correlationId") @ValidCorrelationId String correlationId,
      @RequestBody @NotEmpty(message = "Request body is empty.") byte[] content);

  @GetExchange(value = FILE_IO_OUTPUT_URL)
  @Operation(
      summary =
          "Download output file for given equipment selector and correlation ID. "
              + "Scans the equipment output folder for files containing the correlation ID. "
              + "Returns the oldest matching file if multiple matches are found.")
  @ApiResponse(
      responseCode = "200",
      description = "File found and returned",
      content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE))
  @ApiResponse(
      responseCode = "400",
      description = "Invalid correlation ID format",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(
      responseCode = "404",
      description =
          "No matching file found for the given correlation ID, or the equipment selector is unknown",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(
      responseCode = "503",
      description = "Output folder does not exist or is not accessible",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(responseCode = "429", description = "Too many requests")
  ResponseEntity<Resource> getOutputFile(
      @PathVariable("equipmentSelector") @NotBlank String equipmentSelector,
      @PathVariable("correlationId") @ValidCorrelationId String correlationId);

  @DeleteExchange(value = FILE_IO_URL)
  @Operation(
      summary =
          "Delete input and output files for given equipment selector and correlation ID. "
              + "Scans the input folder by filename template and the output folder for files "
              + "containing the correlation ID embedding (prefix+correlationId+postfix).")
  @ApiResponse(responseCode = "200", description = "File(s) deleted")
  @ApiResponse(responseCode = "204", description = "No files found to delete")
  @ApiResponse(responseCode = "400", description = "Invalid correlation ID format")
  @ApiResponse(responseCode = "404", description = "The equipment selector is unknown")
  @ApiResponse(
      responseCode = "503",
      description = "Input or output folder does not exist or is not accessible")
  @ApiResponse(responseCode = "429", description = "Too many requests")
  ResponseEntity<Void> deleteFiles(
      @PathVariable("equipmentSelector") @NotBlank String equipmentSelector,
      @PathVariable("correlationId") @ValidCorrelationId String correlationId);
}
