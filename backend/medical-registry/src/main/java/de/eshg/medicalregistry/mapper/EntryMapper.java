/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.medicalregistry.api.MedicalRegistryEntryDto;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

public class EntryMapper {
  private EntryMapper() {}

  public static MedicalRegistryEntryDto mapToDto(
      MedicalRegistryProcedure entry, Map<UUID, GetPersonFileStateResponse> relatedPersons) {
    GetPersonFileStateResponse relatedPerson = getRelatedPersonOrThrow(entry, relatedPersons);
    return new MedicalRegistryEntryDto(
        entry.getExternalId(),
        relatedPerson.lastName(),
        relatedPerson.firstName(),
        relatedPerson.dateOfBirth(),
        AddressMapper.mapToApplicantAddressDto(relatedPerson.contactAddress()),
        entry.isRequestForWrittenConfirmation(),
        ProcedureMapper.toInterfaceType(entry.getProcedureStatus()),
        ProcedureMapper.toInterfaceType(entry.getProcedureType()));
  }

  private static GetPersonFileStateResponse getRelatedPersonOrThrow(
      MedicalRegistryProcedure entry, Map<UUID, GetPersonFileStateResponse> personMap) {

    UUID relatedPersonId = entry.getRelatedPersons().getFirst().getCentralFileStateId();

    return Optional.ofNullable(personMap.get(relatedPersonId))
        .orElseThrow(() -> new NoSuchElementException("No matching person found"));
  }
}
