/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.base.util.MapUtils;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.medicalregistry.EmployeeChoiceDto;
import de.eshg.medicalregistry.GetConfirmInfoResponse;
import de.eshg.medicalregistry.MedicalRegistryService;
import de.eshg.medicalregistry.api.MedicalRegistryEntrySearchResultDto;
import de.eshg.medicalregistry.api.PersonCandidateDto;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class ConfirmInfoMapper {
  private ConfirmInfoMapper() {}

  public static GetConfirmInfoResponse mapToConfirmInfoResponse(
      Long version, MedicalRegistryService.ConfirmInfo confirmInfo) {
    return new GetConfirmInfoResponse(
        version,
        confirmInfo.proceduresByMatchingReferencePerson().keySet().stream().toList(),
        confirmInfo.matchingReferenceFacilities(),
        confirmInfo.proceduresByMatchingReferencePerson().entrySet().stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    MapUtils.mapKey(GetReferencePersonResponse::id),
                    MapUtils.mapValue(
                        entries ->
                            mapToEntriesToDto(entries, confirmInfo.resolvedFacilityDetails())))),
        confirmInfo.employeeChoiceByProcedure().entrySet().stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    MapUtils.mapKey(SequencedBaseEntityWithExternalId::getExternalId),
                    MapUtils.mapValue(
                        employeeChoices ->
                            mapEmployeeChoicesToDto(
                                employeeChoices, confirmInfo.resolvedPersonDetails())))));
  }

  private static List<MedicalRegistryEntrySearchResultDto> mapToEntriesToDto(
      List<MedicalRegistryEntry> entries, Map<UUID, FacilityDetails> resolvedFacilityDetails) {
    return entries.stream()
        .map(procedure -> mapToEntryToDto(procedure, resolvedFacilityDetails))
        .toList();
  }

  private static List<EmployeeChoiceDto> mapEmployeeChoicesToDto(
      List<MedicalRegistryService.EmployeeChoice> employeeChoices,
      Map<UUID, GetPersonFileStateResponse> resolvedPersonFileStates) {
    return employeeChoices.stream()
        .map(employeeChoice -> mapEmployeeChoiceToDto(employeeChoice, resolvedPersonFileStates))
        .toList();
  }

  private static MedicalRegistryEntrySearchResultDto mapToEntryToDto(
      MedicalRegistryProcedure procedure, Map<UUID, FacilityDetails> resolvedFacilityDetails) {
    return new MedicalRegistryEntrySearchResultDto(
        procedure.getExternalId(),
        procedure.getVersion(),
        procedure.getCreatedAt(),
        procedure.getModifiedAt(),
        ProcedureMapper.mapStatusToDto(procedure.getProcedureStatus()),
        procedure.getRelatedFacilities().stream()
            .map(RelatedFacility::getCentralFileStateId)
            .map(resolvedFacilityDetails::get)
            .map(FacilityDetails::name)
            .toList());
  }

  private static EmployeeChoiceDto mapEmployeeChoiceToDto(
      MedicalRegistryService.EmployeeChoice choice,
      Map<UUID, ? extends PersonDetails> resolvedPersonFileStates) {
    return new EmployeeChoiceDto(
        PersonMapper.mapEmployeeChangeToDto(choice.employeeChange(), resolvedPersonFileStates),
        choice.personCandidates().stream()
            .map(ConfirmInfoMapper::mapPersonCandidateToDto)
            .toList());
  }

  private static PersonCandidateDto mapPersonCandidateToDto(
      MedicalRegistryService.PersonCandidate candidate) {
    if (candidate == null) {
      return null;
    }
    return new PersonCandidateDto(
        candidate.employeeId(),
        candidate.referencePersonId(),
        candidate.firstName(),
        candidate.lastName(),
        candidate.dateOfBirth());
  }
}
