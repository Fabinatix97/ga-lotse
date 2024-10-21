/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.medicalregistry.api.*;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.mapper.PracticeMapper;
import de.eshg.medicalregistry.mapper.ProfessionalMapper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(MedicalRegistryController.BASE_URL)
@Tag(name = "MedicalRegistry")
public class MedicalRegistryController {

  public static final String BASE_URL = BaseUrls.MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER;

  private final MedicalRegistryService medicalRegistryService;

  public MedicalRegistryController(MedicalRegistryService medicalRegistryService) {
    this.medicalRegistryService = medicalRegistryService;
  }

  @PostMapping
  @Transactional
  @Hidden // TODO currently for testing purposes only
  public UUID createProcedure(@Valid @RequestBody CreateProcedureRequest procedure) {
    MedicalRegistryEntry persistedProcedure = medicalRegistryService.createProcedure(procedure);
    return persistedProcedure.getExternalId();
  }

  @GetMapping("/{procedureId}")
  @Transactional(readOnly = true)
  @Operation(summary = "Get medical registry procedure by id.")
  public GetProcedureResponse getProcedure(@PathVariable("procedureId") UUID procedureId) {
    MedicalRegistryEntry medicalRegistryEntry =
        medicalRegistryService.findProcedureByExternalId(procedureId);

    Professional professional =
        medicalRegistryEntry.getRelatedPersons().stream().collect(StreamUtil.toSingleElement());
    GetPersonFileStateResponse professionalDetails =
        medicalRegistryService.findProfessionalDetails(professional.getCentralFileStateId());

    PracticeDto practiceDto =
        medicalRegistryEntry.getRelatedFacilities().stream()
            .collect(StreamUtil.toSingleOptionalElement())
            .map(this::mapToDto)
            .orElse(null);

    return new GetProcedureResponse(
        medicalRegistryEntry.getExternalId(),
        medicalRegistryEntry.getVersion(),
        ProfessionalMapper.mapToDto(professional, professionalDetails),
        practiceDto,
        medicalRegistryEntry.isEmployeesEmployed(),
        medicalRegistryEntry.isConsentToPrivacyPolicy(),
        medicalRegistryEntry.isRequestForWrittenConfirmation());
  }

  private PracticeDto mapToDto(Practice p) {
    return PracticeMapper.mapToDto(
        p, medicalRegistryService.findPracticeDetails(p.getCentralFileStateId()));
  }
}
