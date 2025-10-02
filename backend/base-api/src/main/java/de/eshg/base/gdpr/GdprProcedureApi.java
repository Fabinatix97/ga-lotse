/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.gdpr.api.AddCentralFileIdToGdprProcedureRequest;
import de.eshg.base.gdpr.api.AddGdprDownloadsRequest;
import de.eshg.base.gdpr.api.AddGdprProcedureFromCitizenPortalRequest;
import de.eshg.base.gdpr.api.AddGdprProcedureRequest;
import de.eshg.base.gdpr.api.CancelGdprProcedureRequest;
import de.eshg.base.gdpr.api.CitizenUsersGdprProcedureDto;
import de.eshg.base.gdpr.api.CloseGdprProcedureRequest;
import de.eshg.base.gdpr.api.DeleteGdprDownloadsRequest;
import de.eshg.base.gdpr.api.GdprProcedureFilterParameters;
import de.eshg.base.gdpr.api.GetCitizenSelfUsersGdprProceduresResponse;
import de.eshg.base.gdpr.api.GetGdprDownloadsResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureDetailsPageResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureFileStateIdsResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureResponse;
import de.eshg.base.gdpr.api.GetGdprProceduresResponse;
import de.eshg.base.gdpr.api.GetIdentificationDataHashResponse;
import de.eshg.base.gdpr.api.SetMatterOfConcernRequest;
import de.eshg.base.gdpr.api.StartGdprProcedureRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.rest.service.security.config.BaseUrls.Base;
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
  String SELF_LINKED_GDPR_PROCEDURES = "/self/linked-gdpr-procedures";
  String CITIZEN_PORTAL_URL = Base.GDPR_PROCEDURE_CITIZEN_PORTAL_URL;
  String DOWNLOADS = Base.Gdpr.DOWNLOADS;
  String DELETE_DOWNLOADS = Base.Gdpr.DELETE_DOWNLOADS;
  String FILE_STATE_IDS = Base.Gdpr.FILE_STATE_IDS;
  String BY_ID = Base.Gdpr.BY_ID;
  String DETAILS_PAGE = Base.Gdpr.DETAILS_PAGE;
  String REPORT_DOCUMENT = Base.Gdpr.REPORT_DOCUMENT;
  String MATTER_OF_CONCERN = Base.Gdpr.MATTER_OF_CONCERN;
  String REFRESH_STATUS = Base.Gdpr.REFRESH_STATUS;
  String START_PROCEDURE = Base.Gdpr.START_PROCEDURE;
  String CANCEL_PROCEDURE = Base.Gdpr.CANCEL_PROCEDURE;
  String CLOSE_PROCEDURE = Base.Gdpr.CLOSE_PROCEDURE;
  String CENTRAL_FILE_DOWNLOAD_PACKAGE = Base.Gdpr.CENTRAL_FILE_DOWNLOAD_PACKAGE;
  String DOWNLOAD_PACKAGE_IDENTIFICATION_DATA_HASH =
      "/download/{downloadId}/identification-data-hash";

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add a GDPR procedure")
  GetGdprProcedureResponse addGdprProcedure(@RequestBody @Valid AddGdprProcedureRequest request);

  @PostExchange(CITIZEN_PORTAL_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  This endpoint allows authenticated MUK and BundID users to initiate a GDPR
  procedure via the citizen portal. A matter of concern can be added to the
  request if desired.
  """)
  CitizenUsersGdprProcedureDto addGdprProcedureFromCitizenPortal(
      @RequestBody @Valid AddGdprProcedureFromCitizenPortalRequest request);

  @GetExchange(CITIZEN_PORTAL_URL + SELF_LINKED_GDPR_PROCEDURES)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get the GDPR procedures linked with the citizen user which is currently active")
  GetCitizenSelfUsersGdprProceduresResponse getCitizenSelfUserLinkedGdprProcedures();

  @GetExchange(BY_ID)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get GDPR procedure by id")
  GetGdprProcedureResponse getGdprProcedure(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id);

  @PostExchange(REFRESH_STATUS)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Refresh status of GDPR procedure.")
  GetGdprProcedureResponse refreshStatus(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id);

  @GetExchange(DETAILS_PAGE)
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

  @PostExchange(BY_ID)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add central file id to GDPR procedure.")
  GetGdprProcedureResponse addCentralFileIdToGdprProcedure(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id,
      @RequestBody @Valid AddCentralFileIdToGdprProcedureRequest request);

  @PutExchange(MATTER_OF_CONCERN)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Changes the matter of concern of this GDPR procedure, this is only relevant for right to correction and right to objection.")
  void setMatterOfConcern(
      @PathVariable("id") UUID id, @RequestBody @Valid SetMatterOfConcernRequest request);

  @PostExchange(START_PROCEDURE)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Start the GDPR procedure")
  void startProcedure(
      @PathVariable("id") UUID id, @RequestBody @Valid StartGdprProcedureRequest request);

  @PostExchange(CANCEL_PROCEDURE)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Cancel the GDPR procedure")
  void cancelProcedure(
      @PathVariable("id") UUID id, @RequestBody @Valid CancelGdprProcedureRequest request);

  @PostExchange(CLOSE_PROCEDURE)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Close the GDPR procedure")
  void closeProcedure(
      @PathVariable("id") UUID id, @RequestBody @Valid CloseGdprProcedureRequest request);

  @GetExchange(FILE_STATE_IDS)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get file state ids of this gdpr procedure.")
  GetGdprProcedureFileStateIdsResponse getFileStateIds(
      @Parameter(description = "The Id of the GDPR procedure.") @PathVariable("id") UUID id);

  @GetExchange(REPORT_DOCUMENT)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Returns the relevant report as PDF for this GDPR Procedure.")
  ResponseEntity<Resource> getReportDocument(@PathVariable("id") UUID id);

  @PostExchange(DOWNLOADS)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Add one or multiple downloads of GDPR-related document or data for this GDPR procedure.")
  void addDownloads(
      @PathVariable("id") UUID id, @RequestBody @Valid AddGdprDownloadsRequest request);

  @GetExchange(DOWNLOADS)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get list of download ids of GDPR-related documents or data of this GDPR procedure.")
  GetGdprDownloadsResponse getDownloads(@PathVariable("id") UUID id);

  @PostExchange(DELETE_DOWNLOADS)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Delete one or multiple downloads of GDPR-related document or data of this GDPR procedure.")
  void deleteDownloads(
      @PathVariable("id") UUID id, @RequestBody @Valid DeleteGdprDownloadsRequest request);

  @GetExchange(CENTRAL_FILE_DOWNLOAD_PACKAGE)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get Gdpr Download Package of central files linked to given Gdpr Procedure Id")
  ResponseEntity<Resource> getCentralFileDownloadPackage(@PathVariable(name = "id") UUID id);

  @GetExchange(DOWNLOAD_PACKAGE_IDENTIFICATION_DATA_HASH)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get Identification Data Hash to given Gdpr Download Package Id")
  GetIdentificationDataHashResponse getIdentificationDataHash(
      @PathVariable(name = "downloadId") UUID downloadId);
}
