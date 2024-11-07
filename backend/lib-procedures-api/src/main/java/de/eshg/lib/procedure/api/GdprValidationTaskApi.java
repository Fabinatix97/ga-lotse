/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(GdprValidationTaskApi.BASE_URL)
public interface GdprValidationTaskApi {

  String BASE_URL = "/gdpr-validation-tasks";

  @PostExchange
  @ApiResponse(responseCode = "200", description = "Add a GDPR validation task")
  @Operation(summary = "Add a GDPR validation task")
  void addGdprValidationTask(@RequestBody @Valid AddGdprValidationTaskRequest request);
}
