/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.procedure.model.gdpr.*;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskFilterParameters;
import de.eshg.lib.procedure.model.gdpr.GetAllValidationTasksResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprNotificationBannerResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskDetailsResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
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
  String BUSINESS_PROCEDURES_URL_SUFFIX = VALIDATION_TASK_URL_SUFFIX + "/business-procedures";
  String DOWNLOAD_PACKAGE_URL_SUFFIX =
      BUSINESS_PROCEDURES_URL_SUFFIX + "/{businessProcedureId}/downloadPackage";
  String GET_DOWNLOAD_PACKAGES_INFO_URL_SUFFIX = VALIDATION_TASK_URL_SUFFIX + "/download-packages";
  String GET_DOWNLOAD_PACKAGE_URL_SUFFIX = "/download-packages/{id}";
  String CLOSE_PROCEDURE_URL_SUFFIX = VALIDATION_TASK_URL_SUFFIX + "/close";

  @PostExchange
  @ApiResponse(responseCode = "200", description = "Add a GDPR validation task")
  @Operation(summary = "Add a GDPR validation task")
  void addGdprValidationTask(@RequestBody @Valid AddGdprValidationTaskRequest request);

  @PostExchange(CLOSE_PROCEDURE_URL_SUFFIX)
  @ApiResponse(responseCode = "200", description = "Close a GDPR validation task")
  @Operation(summary = "Close a GDPR validation task")
  void closeGdprValidationTask(@PathVariable("gdprProcedureId") UUID gdprProcedureId);

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

  @GetExchange(BUSINESS_PROCEDURES_URL_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a GDPR validation task by id")
  GetGdprValidationTaskDetailsResponse getGdprValidationTaskDetails(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("gdprProcedureId")
          UUID gdprProcedureId);

  @GetExchange(GET_DOWNLOAD_PACKAGES_INFO_URL_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get approved Gdpr Download Packages by Gdpr Procedure Id")
  GetGdprDownloadPackagesInfoResponse getGdprDownloadPackagesInfo(
      @PathVariable(name = "gdprProcedureId") UUID gdprProcedureId);

  @GetExchange(GET_DOWNLOAD_PACKAGE_URL_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get Gdpr Download Package by its id")
  ResponseEntity<Resource> getGdprDownloadPackage(@PathVariable(name = "id") UUID id);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get all GDPR validation tasks")
  GetAllValidationTasksResponse getAllGdprValidationTasks(
      @InlineParameterObject @ParameterObject @Valid GdprValidationTaskFilterParameters parameters);
}
