/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.centralfile;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.SearchReferencePersonsResponse;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.measlesprotection.api.AffectedPersonDto;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.rest.service.error.NotFoundException;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

@Component
public class PersonClient {

  private final PersonApi personApi;

  public PersonClient(PersonApi personApi) {
    this.personApi = personApi;
  }

  public UUID createPersonInCentralFile(AffectedPersonDto person) {
    AddPersonFileStateResponse personFileState = personApi.addPersonFileState(addPerson(person));
    return personFileState.id();
  }

  private static AddPersonFileStateRequest addPerson(AffectedPersonDto person) {
    return new AddPersonFileStateRequest(
        null,
        person.title(),
        person.salutation(),
        person.gender(),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        person.nameAtBirth(),
        person.placeOfBirth(),
        person.countryOfBirth(),
        person.emailAddresses(),
        person.phoneNumbers(),
        person.address(),
        null,
        DataOriginDto.MANUAL);
  }

  public ProcedureWithPersonDetailsData augmentWithPersonDetails(
      MeaslesProtectionProcedure procedure) {
    return augmentWithPersonDetails(List.of(procedure)).collect(StreamUtil.toSingleElement());
  }

  public Stream<ProcedureWithPersonDetailsData> augmentWithPersonDetails(
      List<MeaslesProtectionProcedure> procedures) {
    if (procedures.isEmpty()) {
      return Stream.empty();
    }

    Map<UUID, AddPersonFileStateResponse> personsById = fetchAllRelatedPersons(procedures);

    return procedures.stream()
        .map(procedure -> extractRelatedPersonDetailsData(procedure, personsById));
  }

  private Map<UUID, AddPersonFileStateResponse> fetchAllRelatedPersons(
      List<MeaslesProtectionProcedure> procedures) {
    List<UUID> personIdsToFetch =
        procedures.stream()
            .map(Procedure::getRelatedPersons)
            .flatMap(Collection::stream)
            .map(RelatedPerson::getCentralFileStateId)
            .toList();

    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(personIdsToFetch));

    if (response.personFileStates().size() != personIdsToFetch.size()) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return response.personFileStates().stream()
        .collect(StreamUtil.toLinkedHashMap(AddPersonFileStateResponse::id));
  }

  private static ProcedureWithPersonDetailsData extractRelatedPersonDetailsData(
      MeaslesProtectionProcedure procedure, Map<UUID, AddPersonFileStateResponse> personsById) {
    UUID patientId = procedure.getPatientIdFromCentralFile();
    AddPersonFileStateResponse personDto = personsById.get(patientId);
    if (personDto == null) {
      throw new NotFoundException(
          "No related person found", "No related person found: " + patientId);
    }

    List<AddPersonFileStateResponse> custodianDtos =
        procedure.getCustodianIdsFromCentralFile().stream().map(personsById::get).toList();
    return new ProcedureWithPersonDetailsData(procedure, personDto, custodianDtos);
  }

  public PersonFileStateIdsWithSameReferencePerson getPersonFileStateIdsWithSameReferencePerson(
      String firstName, String lastName, LocalDate dateOfBirth) {
    SearchReferencePersonsResponse referencePersons =
        personApi.searchReferencePersons(firstName, lastName, dateOfBirth);
    List<UUID> referencePersonIds =
        referencePersons.persons().stream().map(GetReferencePersonResponse::id).toList();
    List<UUID> fileStateIds =
        referencePersonIds.stream()
            .map(personApi::getPersonFileStateIdsAssociatedWithReferencePerson)
            .flatMap(response -> response.fileStateIds().stream())
            .toList();
    return new PersonFileStateIdsWithSameReferencePerson(fileStateIds);
  }
}
