/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.measlesprotection.api.draft.*;
import de.eshg.measlesprotection.mapper.AffectedPersonDetailsMapper;
import de.eshg.measlesprotection.mapper.CreatePersonResponseMapper;
import de.eshg.measlesprotection.mapper.ReportDataMapper;
import de.eshg.measlesprotection.mapper.RoleStatusMapper;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.ReportData;
import de.eshg.measlesprotection.persistence.db.RoleStatus;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = DraftProtectionProcedureController.BASE_URL)
@Tag(name = "DraftProtectionProcedure")
public class DraftProtectionProcedureController {

  public static final String BASE_URL = BaseUrls.MeaslesProtection.PROCEDURE_CONTROLLER + "/draft";

  private final DraftMeaslesProtectionService draftProcedureService;

  public DraftProtectionProcedureController(DraftMeaslesProtectionService draftProcedureService) {
    this.draftProcedureService = draftProcedureService;
  }

  @PostMapping("/affected-person")
  @Operation(summary = "Create a draft measles protection procedure with an affected person.")
  public CreatePersonResponse createPerson(@Valid @RequestBody CreatePersonRequest request) {
    AddPersonFileStateRequest addPerson =
        AffectedPersonDetailsMapper.getAddPersonRequest(request.person());
    MeaslesProtectionProcedure procedure = draftProcedureService.addPerson(addPerson);
    return CreatePersonResponseMapper.toInterfaceType(procedure, request.person());
  }

  @PostMapping("{id}/custodians")
  @Operation(summary = "Add custodian to a draft measles protection procedure.")
  public AddCustodianResponse addCustodian(
      @PathVariable("id") UUID id, @Valid @RequestBody AddCustodianRequest request) {
    AddPersonFileStateRequest addCustodian =
        AffectedPersonDetailsMapper.getAddPersonRequest(request.custodian());
    MeaslesProtectionProcedure procedure = draftProcedureService.addCustodian(id, addCustodian);
    return new AddCustodianResponse(procedure.getExternalId(), request.custodian());
  }

  @PostMapping("{id}/facilities")
  @Operation(summary = "Add facility to a draft measles protection procedure.")
  public AddFacilityResponse addFacility(
      @PathVariable("id") UUID id, @Valid @RequestBody AddFacilityRequest request) {
    return draftProcedureService.addFacility(id, request);
  }

  @PostMapping("{id}/open")
  @Operation(summary = "Finalize draft of measles protection procedure.")
  public OpenProcedureResponse openProcedure(
      @PathVariable("id") UUID id, @Valid @RequestBody OpenProcedureRequest request) {
    ReportData reportData = ReportDataMapper.toDatabaseType(request.reportData());
    RoleStatus roleStatus = RoleStatusMapper.toDatabaseType(request.roleStatus());
    MeaslesProtectionProcedure procedure =
        draftProcedureService.openProcedure(id, reportData, roleStatus);
    return new OpenProcedureResponse(procedure.getExternalId());
  }
}
