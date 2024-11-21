/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.GetGdprNotificationBannerResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskResponse;
import de.eshg.lib.procedure.model.gdpr.GetRelatedBusinessProceduresResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(GdprValidationTaskApi.BASE_URL)
public interface GdprValidationTaskApi {
  String BASE_URL = "/gdpr-validation-tasks";
  String NOTIFICATION_BANNER_URL_SUFFIX = "/notification-banner";
  String VALIDATION_TASK_URL_SUFFIX = "/{gdprProcedureId}";
  String BUSINESS_PROCEDURES_SUFFIX = VALIDATION_TASK_URL_SUFFIX + "/business-procedures";
  String DOWNLOAD_PACKAGE_URL_SUFFIX =
      BUSINESS_PROCEDURES_SUFFIX + "/{businessProcedureId}/downloadPackage";

  @PostExchange
  @ApiResponse(responseCode = "200", description = "Add a GDPR validation task")
  @Operation(summary = "Add a GDPR validation task")
  void addGdprValidationTask(@RequestBody @Valid AddGdprValidationTaskRequest request);

  @PostExchange(DOWNLOAD_PACKAGE_URL_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Creates a downloadPackage for validationTask with gdprProcedureId with the data from the procedure with businessProcedureId")
  void addDownloadPackage(
      @PathVariable("gdprProcedureId") UUID gdprProcedureId,
      @PathVariable("businessProcedureId") UUID businessProcedureId);

  @GetExchange(NOTIFICATION_BANNER_URL_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get data for GDPR notification banner")
  GetGdprNotificationBannerResponse getGdprNotificationBanner();

  @GetExchange(VALIDATION_TASK_URL_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get Gdpr Validation Task by Gdpr Procedure Id")
  GetGdprValidationTaskResponse getGdprValidationTask(
      @PathVariable(name = "gdprProcedureId") UUID gdprProcedureId);

  @GetExchange(BUSINESS_PROCEDURES_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a GDPR validation task by id")
  GetRelatedBusinessProceduresResponse getRelatedBusinessProcedures(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("gdprProcedureId")
          UUID gdprProcedureId);
}
