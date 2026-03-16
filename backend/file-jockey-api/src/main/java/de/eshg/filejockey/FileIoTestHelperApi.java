/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import de.eshg.filejockey.validation.ValidCorrelationId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(url = FileIoTestHelperApi.TEST_HELPER_BASE_URL)
public interface FileIoTestHelperApi {

  String TEST_HELPER_BASE_URL = "/test-helper";
  String TEST_HELPER_TEMPLATE_UPLOAD_URL = "/{equipmentSelector}/{correlationId}/output-device";

  @PutExchange(value = TEST_HELPER_TEMPLATE_UPLOAD_URL)
  @Operation(
      summary =
          "Create an output file for device using a mock template file. "
              + "Inserts a correlationId embedding specific for passed parameters.")
  @ApiResponse(responseCode = "200", description = "Output file created")
  @ApiResponse(
      responseCode = "200",
      description = "Output file created",
      content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE))
  @ApiResponse(
      responseCode = "400",
      description = "Invalid correlation ID format",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(
      responseCode = "404",
      description = "Provided equipment selector is unknown",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(
      responseCode = "503",
      description = "Output folder does not exist or is not accessible",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(responseCode = "429", description = "Too many requests")
  ResponseEntity<Void> createBasicDeviceOutputFile(
      @PathVariable("equipmentSelector") @NotBlank String equipmentSelector,
      @PathVariable("correlationId") @ValidCorrelationId String correlationId);
}
