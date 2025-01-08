/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureDetailsDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureHeaderDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedurePaginationAndSortParameters;
import de.eshg.officialmedicalservice.procedure.api.EmployeePagedOmsProcedures;
import de.eshg.officialmedicalservice.procedure.api.GetEmployeeOmsProcedureOverviewResponse;
import de.eshg.officialmedicalservice.procedure.api.PatchAffectedPersonRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = EmployeeOmsProcedureController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "EmployeeOmsProcedure")
public class EmployeeOmsProcedureController {
  public static final String BASE_URL = BaseUrls.OfficialMedicalService.EMPLOYEE_API;
  public static final String PROCEDURES = "/procedures";
  public static final String AFFECTED_PERSON = "/affected-person";

  private final EmployeeOmsProcedureService employeeOmsProcedureService;

  public EmployeeOmsProcedureController(EmployeeOmsProcedureService employeeOmsProcedureService) {
    this.employeeOmsProcedureService = employeeOmsProcedureService;
  }

  @PostMapping(path = PROCEDURES)
  @Operation(summary = "Save a new employee oms procedure")
  public UUID postEmployeeProcedure(@RequestBody @Valid PostEmployeeOmsProcedureRequest request) {
    return employeeOmsProcedureService.createEmployeeProcedure(request);
  }

  @GetMapping(path = PROCEDURES + "/{id}/header")
  @Operation(summary = "Get details of an oms procedure")
  public EmployeeOmsProcedureHeaderDto getEmployeeProcedureHeader(
      @PathVariable("id") UUID externalId) {
    return employeeOmsProcedureService.getEmployeeProcedureHeader(externalId);
  }

  @GetMapping(path = PROCEDURES + "/{id}/details")
  @Operation(summary = "Get details of an oms procedure")
  public EmployeeOmsProcedureDetailsDto getEmployeeProcedureDetails(
      @PathVariable("id") UUID externalId) {
    return employeeOmsProcedureService.getEmployeeProcedureDetails(externalId);
  }

  @GetMapping(path = PROCEDURES)
  @Operation(summary = "Get all oms procedures")
  public GetEmployeeOmsProcedureOverviewResponse getAllEmployeeProcedures(
      @InlineParameterObject @ParameterObject @Valid
          EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters) {
    EmployeePagedOmsProcedures pagedOmsProcedures =
        employeeOmsProcedureService.getEmployeeProceduresOverview(paginationAndSortParameters);
    return new GetEmployeeOmsProcedureOverviewResponse(
        pagedOmsProcedures.proceduresPage(), pagedOmsProcedures.totalNumberOfProcedures());
  }

  @PatchMapping(path = PROCEDURES + "/{procedureId}" + AFFECTED_PERSON)
  @Operation(summary = "Update affected person in an oms procedure")
  public void updateAffectedPerson(
      @PathVariable("procedureId") UUID externalId,
      @RequestBody @Valid PatchAffectedPersonRequest patchAffectedPersonRequest) {
    employeeOmsProcedureService.updateAffectedPerson(externalId, patchAffectedPersonRequest);
  }

  @PostMapping(path = PROCEDURES + "/{id}/facility")
  @Operation(summary = "Add facility to a draft oms procedure")
  public UUID postFacility(
      @PathVariable("id") UUID id,
      @Valid @RequestBody PostEmployeeOmsProcedureFacilityRequest request) {
    return employeeOmsProcedureService.addFacility(id, request);
  }

  @PatchMapping(path = PROCEDURES + "/{id}/facility")
  @Operation(summary = "Updates a facility")
  public void patchFacility(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody PatchEmployeeOmsProcedureFacilityRequest request) {
    employeeOmsProcedureService.updateFacility(externalId, request);
  }
}
