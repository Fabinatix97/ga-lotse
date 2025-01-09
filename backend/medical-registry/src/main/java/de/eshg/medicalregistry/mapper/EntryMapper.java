/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.medicalregistry.api.MedicalRegistryEntryDto;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.PartialMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;

public class EntryMapper {
  private EntryMapper() {}

  public static List<MedicalRegistryEntryDto> mapToDto(
      Page<MedicalRegistryProcedure> page,
      Map<UUID, GetPersonFileStateResponse> resolvedRelatedPerson) {
    return page.stream().map(entry -> mapToDto(entry, resolvedRelatedPerson)).toList();
  }

  public static MedicalRegistryEntryDto mapToDto(
      MedicalRegistryProcedure entry, Map<UUID, GetPersonFileStateResponse> relatedPersons) {
    GetPersonFileStateResponse relatedPerson = getRelatedPersonOrThrow(entry, relatedPersons);
    Optional<ProfessionInformation> professionalInformation = getProfessionalInformation(entry);

    return new MedicalRegistryEntryDto(
        entry.getExternalId(),
        relatedPerson.lastName(),
        relatedPerson.firstName(),
        professionalInformation
            .map(info -> ProfessionalMapper.mapToDto(info.getProfessionalTitle()))
            .orElse(null),
        relatedPerson.dateOfBirth(),
        AddressMapper.mapToApplicantAddressDto(relatedPerson.contactAddress()),
        entry.isRequestForWrittenConfirmation(),
        ProcedureMapper.toInterfaceType(entry.getProcedureStatus()),
        ProcedureMapper.toInterfaceType(entry.getProcedureType()),
        entry.getCreatedAt());
  }

  private static GetPersonFileStateResponse getRelatedPersonOrThrow(
      MedicalRegistryProcedure entry, Map<UUID, GetPersonFileStateResponse> personMap) {

    UUID relatedPersonId = entry.getRelatedPersons().getFirst().getCentralFileStateId();

    return Optional.ofNullable(personMap.get(relatedPersonId))
        .orElseThrow(() -> new NoSuchElementException("No matching person found"));
  }

  private static Optional<ProfessionInformation> getProfessionalInformation(
      MedicalRegistryProcedure source) {
    return switch (source) {
      case FullMedicalRegistryEntryChange fullProcedureChange ->
          Optional.of(fullProcedureChange.getProfessionInformation());
      case PartialMedicalRegistryEntryChange ignored -> Optional.empty();
      case MedicalRegistryEntry medicalRegistryEntry ->
          Optional.of(medicalRegistryEntry.getProfessionInformation());
      default -> throw new IllegalStateException("Unknown procedure type");
    };
  }
}
