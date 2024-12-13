/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.base.centralfile.api.person.UpdateReferencePersonRequest;
import de.eshg.lib.procedure.MapperHelper;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.ProfessionalReferencePersonDto;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.importer.MedicalRegistryRow;
import de.eshg.medicalregistry.mapper.AddressMapper;
import de.eshg.medicalregistry.mapper.EnrichmentHelper;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

  private static final Logger log = LoggerFactory.getLogger(PersonService.class);
  private final PersonApi personApi;

  public PersonService(PersonApi personApi) {
    this.personApi = personApi;
  }

  GetPersonFileStateResponse findProfessionalDetails(Professional professional) {
    return personApi.getPersonFileState(professional.getCentralFileStateId());
  }

  UUID createPersonInCentralFile(CreateApplicantDto professional) {
    AddPersonFileStateResponse addPersonResponse =
        personApi.addPersonFromExternalSource(
            new ExternalAddPersonFileStateRequest(
                professional.getTitle(),
                null,
                professional.getGender(),
                professional.getFirstName(),
                professional.getLastName(),
                professional.getDateOfBirth(),
                professional.getNameAtBirth(),
                professional.getPlaceOfBirth(),
                null,
                MapperHelper.toList(professional.getEmailAddress()),
                MapperHelper.toList(professional.getPhoneNumber()),
                AddressMapper.mapAddress(professional.getAddress()),
                null));

    return addPersonResponse.id();
  }

  Map<MedicalRegistryRow, UUID> createPersonsInCentralFile(List<MedicalRegistryRow> rows) {
    List<UUID> fileStateIds =
        personApi
            .addPersonFileStates(
                new AddPersonFileStatesRequest(
                    rows.stream()
                        .map(MedicalRegistryRow::getApplicant)
                        .map(PersonService::mapToAddPersonFileStateRequest)
                        .toList()))
            .personFileStateIds();
    return IntStream.range(0, rows.size())
        .boxed()
        .collect(Collectors.toMap(rows::get, fileStateIds::get));
  }

  UUID updateOrConfirmProfessional(
      UUID professionalFileStateId, ProfessionalReferencePersonDto professionalReferencePerson) {
    GetPersonFileStateResponse professionalFileState =
        personApi.getPersonFileState(professionalFileStateId);

    if (professionalReferencePerson != null) {
      return updateReferencePersonWithDraftDetails(
          professionalFileState, professionalReferencePerson);
    } else {
      return confirmPerson(professionalFileState);
    }
  }

  Map<UUID, GetPersonFileStateResponse> resolvePersonDetailsById(
      Page<MedicalRegistryProcedure> medicalRegistryEntries) {
    List<UUID> centralFileStateIds = collectCentralFileStateIds(medicalRegistryEntries);
    if (centralFileStateIds.isEmpty()) {
      return Map.of();
    }

    return personApi
        .getPersonFileStates(new GetPersonFileStatesRequest(centralFileStateIds))
        .personFileStates()
        .stream()
        .collect(Collectors.toMap(GetPersonFileStateResponse::id, person -> person));
  }

  private static List<UUID> collectCentralFileStateIds(
      Page<MedicalRegistryProcedure> medicalRegistryEntries) {
    return medicalRegistryEntries.stream()
        .map(Procedure::getRelatedPersons)
        .flatMap(Collection::stream)
        .map(RelatedPerson::getCentralFileStateId)
        .toList();
  }

  private UUID confirmPerson(GetPersonFileStateResponse personFileState) {
    log.info("Confirming person {} in central file", personFileState);

    return personApi
        .updatePersonFileStateAndReference(
            personFileState.id(), new UpdatePersonRequest(new PersonDetailsDto(personFileState)))
        .id();
  }

  private UUID updateReferencePersonWithDraftDetails(
      GetPersonFileStateResponse draftProfessionalFileState,
      ProfessionalReferencePersonDto professionalReference) {
    log.info(
        "Updating person {} in central file state with draft details", professionalReference.id());

    AddPersonFileStateResponse updatedFileState =
        personApi.updateReferencePerson(
            professionalReference.id(),
            new UpdateReferencePersonRequest(
                enrich(draftProfessionalFileState, professionalReference),
                professionalReference.version()));

    personApi.markPersonFileStateForDeletion(
        new DeleteFileStatesRequest(draftProfessionalFileState.id()));

    return updatedFileState.id();
  }

  private PersonDetailsDto enrich(PersonDetails newPersonDetails, PersonDetails oldPersonDetails) {
    return new PersonDetailsDto(
        EnrichmentHelper.enrich(PersonDetails::title, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::salutation, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::gender, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::firstName, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::lastName, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::dateOfBirth, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::nameAtBirth, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::placeOfBirth, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::countryOfBirth, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrichList(
            PersonDetails::emailAddresses, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrichList(
            PersonDetails::phoneNumbers, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::contactAddress, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(
            PersonDetails::differentBillingAddress, newPersonDetails, oldPersonDetails));
  }

  private static AddPersonFileStateRequest mapToAddPersonFileStateRequest(
      CreateApplicantDto professional) {
    return new AddPersonFileStateRequest(
        null,
        professional.getTitle(),
        null,
        professional.getGender(),
        professional.getFirstName(),
        professional.getLastName(),
        professional.getDateOfBirth(),
        professional.getNameAtBirth(),
        professional.getPlaceOfBirth(),
        null,
        MapperHelper.toList(professional.getEmailAddress()),
        MapperHelper.toList(professional.getPhoneNumber()),
        AddressMapper.mapAddress(professional.getAddress()),
        null,
        DataOriginDto.IMPORT);
  }
}
