/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.gdpr.api.AddGdprProcedureRequest;
import de.eshg.base.gdpr.api.GdprProcedureChangeStatusRequest;
import de.eshg.base.gdpr.api.GetGdprProcedureDetailsPageResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureResponse;
import de.eshg.base.gdpr.api.SetMatterOfConcernRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(url = GdprProcedureApi.BASE_URL)
public interface GdprProcedureApi {
  String BASE_URL = BaseUrls.Base.GDPR_PROCEDURE_API;

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add a GDPR procedure")
  GetGdprProcedureResponse addGdprProcedure(@RequestBody @Valid AddGdprProcedureRequest request);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get GDPR procedure by id")
  GetGdprProcedureResponse getGdprProcedure(
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

  @PostExchange("/{id}/change-status")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Changes the current status of the GDPR procedure.")
  void changeStatus(
      @PathVariable("id") UUID id, @RequestBody @Valid GdprProcedureChangeStatusRequest request);
}
