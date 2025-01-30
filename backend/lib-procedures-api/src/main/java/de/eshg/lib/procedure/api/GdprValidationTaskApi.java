/*
 * Copyright 2025 cronn GmbH
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
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
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
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(GdprValidationTaskApi.BASE_URL)
public interface GdprValidationTaskApi {
  String BASE_URL = ProcedureLibrary.GDPR_VALIDATION_TASK_API;
  String NOTIFICATION_BANNER = ProcedureLibrary.Gdpr.NOTIFICATION_BANNER;
  String BY_GDPR_ID = ProcedureLibrary.Gdpr.BY_GDPR_ID;
  String BUSINESS_PROCEDURES = ProcedureLibrary.Gdpr.BUSINESS_PROCEDURES;
  String BUSINESS_PROCEDURE = ProcedureLibrary.Gdpr.BUSINESS_PROCEDURE;
  String BUSINESS_PROCEDURE_DOWNLOAD_PACKAGE =
      ProcedureLibrary.Gdpr.BUSINESS_PROCEDURE_DOWNLOAD_PACKAGE;
  String DOWNLOAD_PACKAGES_INFO = ProcedureLibrary.Gdpr.DOWNLOAD_PACKAGES_INFO;
  String DOWNLOAD_PACKAGE = ProcedureLibrary.Gdpr.DOWNLOAD_PACKAGE;
  String CLOSE_PROCEDURE = ProcedureLibrary.Gdpr.CLOSE_PROCEDURE;

  @PostExchange
  @ApiResponse(responseCode = "200", description = "Add a GDPR validation task")
  @Operation(summary = "Add a GDPR validation task")
  void addGdprValidationTask(@RequestBody @Valid AddGdprValidationTaskRequest request);

  @PostExchange(CLOSE_PROCEDURE)
  @ApiResponse(responseCode = "200", description = "Close a GDPR validation task")
  @Operation(summary = "Close a GDPR validation task")
  void closeGdprValidationTask(@PathVariable("gdprProcedureId") UUID gdprProcedureId);

  @PostExchange(BUSINESS_PROCEDURE_DOWNLOAD_PACKAGE)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Creates a downloadPackage for validationTask with gdprProcedureId with the data from the procedure with businessProcedureId")
  void addDownloadPackage(
      @PathVariable("gdprProcedureId") UUID gdprProcedureId,
      @PathVariable("businessProcedureId") UUID businessProcedureId);

  @GetExchange(NOTIFICATION_BANNER)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get data for GDPR notification banner")
  GetGdprNotificationBannerResponse getGdprNotificationBanner();

  @GetExchange(BY_GDPR_ID)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get Gdpr Validation Task by Gdpr Procedure Id")
  GetGdprValidationTaskResponse getGdprValidationTask(
      @PathVariable(name = "gdprProcedureId") UUID gdprProcedureId);

  @GetExchange(BUSINESS_PROCEDURES)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a GDPR validation task by id")
  GetGdprValidationTaskDetailsResponse getGdprValidationTaskDetails(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("gdprProcedureId")
          UUID gdprProcedureId);

  @DeleteExchange(BUSINESS_PROCEDURE)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Delete the businessProcedure with businessProcedureId for validationTask with gdprProcedureId with type right of erasure")
  void deleteBusinessProcedure(
      @PathVariable("gdprProcedureId") UUID gdprProcedureId,
      @PathVariable("businessProcedureId") UUID businessProcedureId);

  @GetExchange(DOWNLOAD_PACKAGES_INFO)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get approved Gdpr Download Packages by Gdpr Procedure Id")
  GetGdprDownloadPackagesInfoResponse getGdprDownloadPackagesInfo(
      @PathVariable(name = "gdprProcedureId") UUID gdprProcedureId);

  @GetExchange(DOWNLOAD_PACKAGE)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get Gdpr Download Package by the gdprProcedureId and its downloadId")
  ResponseEntity<Resource> getGdprDownloadPackage(
      @PathVariable(name = "gdprProcedureId") UUID gdprProcedureId,
      @PathVariable(name = "downloadId") UUID downloadId);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get all GDPR validation tasks")
  GetAllValidationTasksResponse getAllGdprValidationTasks(
      @InlineParameterObject @ParameterObject @Valid GdprValidationTaskFilterParameters parameters);

  @DeleteExchange(BY_GDPR_ID)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Delete the GDPR validation task with gdprProcedureId and GDPR download packages with ids from request")
  void deleteGdprValidationTaskAndDownloadPackages(
      @PathVariable(name = "gdprProcedureId") UUID gdprProcedureId,
      @RequestBody @Valid DeleteDownloadPackagesRequest request);
}
