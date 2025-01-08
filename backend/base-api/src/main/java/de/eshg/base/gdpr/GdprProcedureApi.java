/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.gdpr.api.AddCentralFileIdToGdprProcedureRequest;
import de.eshg.base.gdpr.api.AddGdprDownloadsRequest;
import de.eshg.base.gdpr.api.AddGdprProcedureRequest;
import de.eshg.base.gdpr.api.CancelGdprProcedureRequest;
import de.eshg.base.gdpr.api.CloseGdprProcedureRequest;
import de.eshg.base.gdpr.api.DeleteGdprDownloadsRequest;
import de.eshg.base.gdpr.api.GdprProcedureFilterParameters;
import de.eshg.base.gdpr.api.GetGdprDownloadsResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureDetailsPageResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureFileStateIdsResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureResponse;
import de.eshg.base.gdpr.api.GetGdprProceduresResponse;
import de.eshg.base.gdpr.api.SetMatterOfConcernRequest;
import de.eshg.base.gdpr.api.StartGdprProcedureRequest;
import de.eshg.rest.service.security.config.BaseUrls;
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
import org.springframework.web.service.annotation.*;

@HttpExchange(url = GdprProcedureApi.BASE_URL)
public interface GdprProcedureApi {
  String BASE_URL = BaseUrls.Base.GDPR_PROCEDURE_API;
  String REFRESH_URL_SUFFIX = "/{id}/refresh-status";

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add a GDPR procedure")
  GetGdprProcedureResponse addGdprProcedure(@RequestBody @Valid AddGdprProcedureRequest request);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get GDPR procedure by id")
  GetGdprProcedureResponse getGdprProcedure(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id);

  @PostExchange(REFRESH_URL_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Refresh status of GDPR procedure.")
  GetGdprProcedureResponse refreshStatus(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id);

  @GetExchange("/{id}/details-page")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get GDPR procedure details page information. Used exclusively by the frontend to display the GDPR Procedure.")
  GetGdprProcedureDetailsPageResponse getGdprProcedureDetailsPage(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get all GDPR procedures. Filter result by type. Sort and page the results by createdAt.")
  GetGdprProceduresResponse getGdprProcedures(
      @InlineParameterObject @ParameterObject @Valid GdprProcedureFilterParameters parameters);

  @PostExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add central file id to GDPR procedure.")
  GetGdprProcedureResponse addCentralFileIdToGdprProcedure(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id,
      @RequestBody @Valid AddCentralFileIdToGdprProcedureRequest request);

  @PutExchange("/{id}/matter-of-concern")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Changes the matter of concern of this GDPR procedure, this is only relevant for right to correction and right to objection.")
  void setMatterOfConcern(
      @PathVariable("id") UUID id, @RequestBody @Valid SetMatterOfConcernRequest request);

  @PostExchange("/{id}/start-procedure")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Start the GDPR procedure")
  void startProcedure(
      @PathVariable("id") UUID id, @RequestBody @Valid StartGdprProcedureRequest request);

  @PostExchange("/{id}/cancel-procedure")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Cancel the GDPR procedure")
  void cancelProcedure(
      @PathVariable("id") UUID id, @RequestBody @Valid CancelGdprProcedureRequest request);

  @PostExchange("/{id}/close-procedure")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Close the GDPR procedure")
  void closeProcedure(
      @PathVariable("id") UUID id, @RequestBody @Valid CloseGdprProcedureRequest request);

  @GetExchange("/{id}/fileStateIds")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get file state ids of this gdpr procedure.")
  GetGdprProcedureFileStateIdsResponse getFileStateIds(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id);

  @GetExchange("/{id}/report-document")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Returns the relevant report as PDF for this GDPR Procedure.")
  ResponseEntity<Resource> getReportDocument(@PathVariable("id") UUID id);

  @PostExchange("/{id}/downloads")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Add one or multiple downloads of GDPR-related document or data for this GDPR procedure.")
  void addDownloads(
      @PathVariable("id") UUID id, @RequestBody @Valid AddGdprDownloadsRequest request);

  @GetExchange("/{id}/downloads")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get list of download ids of GDPR-related documents or data of this GDPR procedure.")
  GetGdprDownloadsResponse getDownloads(@PathVariable("id") UUID id);

  @DeleteExchange("/{id}/downloads")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Delete one or multiple downloads of GDPR-related document or data of this GDPR procedure.")
  void deleteDownloads(
      @PathVariable("id") UUID id, @RequestBody @Valid DeleteGdprDownloadsRequest request);

  @GetExchange("/{id}/central-file-download-package")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get Gdpr Download Package of central files linked to given Gdpr Procedure Id")
  ResponseEntity<Resource> getCentralFileDownloadPackage(@PathVariable(name = "id") UUID id);
}
