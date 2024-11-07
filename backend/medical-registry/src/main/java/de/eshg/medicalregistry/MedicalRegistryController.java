/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.medicalregistry.mapper.ProcedureMapper.*;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.file.common.FileType;
import de.eshg.lib.procedure.model.GetProceduresPaginationOptions;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.DeleteProcedureRequest;
import de.eshg.medicalregistry.api.GetMedicalRegistryEntryOverview;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresFilterOptions;
import de.eshg.medicalregistry.api.GetProcedureResponse;
import de.eshg.medicalregistry.business.model.DocumentData;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(MedicalRegistryController.BASE_URL)
@Tag(name = "MedicalRegistry")
public class MedicalRegistryController {

  public static final String BASE_URL = BaseUrls.MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER;

  private final MedicalRegistryService medicalRegistryService;

  public MedicalRegistryController(MedicalRegistryService medicalRegistryService) {
    this.medicalRegistryService = medicalRegistryService;
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public UUID createProcedure(
      @RequestPart(name = "procedure") @Valid CreateProcedureRequest request,
      @RequestPart(name = "professionalLicenseCertificate", required = false)
          MultipartFile professionalLicenseCertificate,
      @RequestPart(name = "identificationDocument") MultipartFile identificationDocument,
      @RequestPart(name = "workPermit", required = false) MultipartFile workPermit,
      @RequestPart(name = "employeeList", required = false) MultipartFile employeeList,
      @RequestPart(name = "otherRelevantDocuments", required = false)
          MultipartFile otherRelevantDocuments)
      throws IOException {

    List<DocumentData> providedDocuments =
        Stream.of(
                new DocumentData(
                    "Berufserlaubnisurkunde",
                    "Upload Berufserlaubnisurkunde",
                    professionalLicenseCertificate),
                new DocumentData("Ausweis_Pass", "Upload Ausweis/Pass", identificationDocument),
                new DocumentData("Arbeitserlaubnis", "Upload Arbeitserlaubnis", workPermit),
                new DocumentData("Mitarbeiter_Liste", "Upload Mitarbeiter-Liste", employeeList),
                new DocumentData(
                    "Weitere_relevante_Dokumente",
                    "Upload weiterer relevanter Dokumente",
                    otherRelevantDocuments))
            .filter(d -> d.getFile() != null)
            .toList();

    for (DocumentData document : providedDocuments) {
      Validator.validateFileType(document.getFile(), FileType.JPEG);
    }

    MedicalRegistryEntryChange procedure =
        medicalRegistryService.createProcedure(request, providedDocuments);

    return procedure.getExternalId();
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

    Map<UUID, GetFacilityFileStateResponse> practiceDetails =
        medicalRegistryEntry.getRelatedFacilities().stream()
            .map(f -> medicalRegistryService.findPracticeDetails(f.getCentralFileStateId()))
            .collect(Collectors.toMap(GetFacilityFileStateResponse::id, facility -> facility));

    return mapToDto(medicalRegistryEntry, professionalDetails, practiceDetails);
  }

  @DeleteMapping("/{procedureId}")
  @Transactional
  @Operation(summary = "Delete medical registry procedure by id.")
  public void deleteProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody DeleteProcedureRequest request) {
    MedicalRegistryEntry medicalRegistryEntry =
        medicalRegistryService.findProcedureByExternalIdForUpdate(procedureId, request.version());

    Validator.validateIsDraft(medicalRegistryEntry);

    medicalRegistryService.deleteProcedure(medicalRegistryEntry);
  }

  @GetMapping("/procedures")
  @Transactional(readOnly = true)
  @Operation(
      summary =
          "Get paginated and optionally filtered medical registry procedures. Filtering is optional")
  public GetMedicalRegistryEntryOverview getProcedureOverview(
      @Valid @ParameterObject @InlineParameterObject
          GetProceduresPaginationOptions paginationOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetMedicalRegistryProceduresFilterOptions filterOptions) {

    return medicalRegistryService.getProceduresOverview(paginationOptions, filterOptions);
  }
}
