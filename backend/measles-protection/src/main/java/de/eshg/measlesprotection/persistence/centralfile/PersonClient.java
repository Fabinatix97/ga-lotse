/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.centralfile;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.PersonWithoutDateOfBirthApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonDiffResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonWithoutDateOfBirthResponse;
import de.eshg.base.centralfile.api.person.GetPersonsWithoutDateOfBirthResponse;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.measlesprotection.api.AffectedPersonDto;
import de.eshg.measlesprotection.api.draft.CustodianWithoutDateOfBirthDetailsDto;
import de.eshg.measlesprotection.mapper.AffectedPersonDetailsMapper;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.rest.service.error.NotFoundException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PersonClient {

  private static final Logger log = LoggerFactory.getLogger(PersonClient.class);

  private final PersonApi personApi;
  private final PersonWithoutDateOfBirthApi personWithoutDateOfBirthApi;

  public PersonClient(
      PersonApi personApi, PersonWithoutDateOfBirthApi personWithoutDateOfBirthApi) {
    this.personApi = personApi;
    this.personWithoutDateOfBirthApi = personWithoutDateOfBirthApi;
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
    return augmentWithPersonDetails(List.of(procedure), true).collect(StreamUtil.toSingleElement());
  }

  public Stream<ProcedureWithPersonDetailsData> augmentWithPersonDetails(
      List<MeaslesProtectionProcedure> procedures, boolean checkOutdated) {
    if (procedures.isEmpty()) {
      return Stream.empty();
    }

    Map<UUID, GetPersonFileStateResponse> personsById =
        fetchAllRelatedPersons(procedures, checkOutdated);

    Map<UUID, GetPersonWithoutDateOfBirthResponse> custodiansWithoutDoBById =
        fetchAllCustodiansWithoutDoB(procedures);

    return procedures.stream()
        .map(
            procedure ->
                extractRelatedPersonDetailsData(procedure, personsById, custodiansWithoutDoBById));
  }

  private Map<UUID, GetPersonFileStateResponse> fetchAllRelatedPersons(
      List<MeaslesProtectionProcedure> procedures, boolean checkOutdated) {
    List<UUID> personIdsToFetch =
        procedures.stream()
            .map(Procedure::getRelatedPersons)
            .flatMap(Collection::stream)
            .map(RelatedPerson::getCentralFileStateId)
            .toList();

    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(
            new GetPersonFileStatesRequest(personIdsToFetch, checkOutdated));

    if (response.personFileStates().size() != personIdsToFetch.size()) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return response.personFileStates().stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  private Map<UUID, GetPersonWithoutDateOfBirthResponse> fetchAllCustodiansWithoutDoB(
      List<MeaslesProtectionProcedure> procedures) {
    List<UUID> custodiansToFetch =
        procedures.stream()
            .map(MeaslesProtectionProcedure::getCustodiansWithoutDob)
            .flatMap(Collection::stream)
            .toList();

    GetPersonsWithoutDateOfBirthResponse response =
        personWithoutDateOfBirthApi.getPersonsWithoutDateOfBirth(custodiansToFetch);

    if (response.personsWithoutDateOfBirth().size() != custodiansToFetch.size()) {
      throw new IllegalStateException("Some custodians were not found in the central file.");
    }
    return response.personsWithoutDateOfBirth().stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonWithoutDateOfBirthResponse::id));
  }

  private ProcedureWithPersonDetailsData extractRelatedPersonDetailsData(
      MeaslesProtectionProcedure procedure,
      Map<UUID, GetPersonFileStateResponse> personsById,
      Map<UUID, GetPersonWithoutDateOfBirthResponse> custodiansWithoutDoBById) {
    UUID patientId = procedure.getPatientIdFromCentralFile();
    GetPersonFileStateResponse personDto = personsById.get(patientId);
    if (personDto == null) {
      throw new NotFoundException(
          "No related person found", "No related person of the given patient found");
    }

    List<GetPersonFileStateResponse> custodianDtos =
        procedure.getCustodianIdsFromCentralFile().stream().map(personsById::get).toList();

    List<GetPersonWithoutDateOfBirthResponse> custodiansWithoutDoBDtos =
        procedure.getCustodiansWithoutDob().stream().map(custodiansWithoutDoBById::get).toList();

    return new ProcedureWithPersonDetailsData(
        procedure, personDto, custodianDtos, custodiansWithoutDoBDtos);
  }

  public List<UUID> getPersonFileStatesAssociatedWith(UUID personId) {
    return personApi.getPersonFileStateIdsAssociatedWithReferencePerson(personId).fileStateIds();
  }

  public AddPersonFileStateResponse updatePersonFileStateAndReference(
      UUID id, UpdatePersonRequest request) {
    return personApi.updatePersonFileStateAndReference(id, request);
  }

  public UUID syncPersonFileState(UUID fileStateId, long referenceVersion) {
    return personApi.syncFileState(fileStateId, new SyncFileStateRequest(referenceVersion)).id();
  }

  public GetPersonDiffResponse getPersonDiff(UUID fileStateId) {
    return personApi.getPersonDiff(fileStateId);
  }

  public CustodianWithoutDateOfBirthDetailsDto updatePersonWithoutDateOfBirthInCentralFile(
      UUID id, CustodianWithoutDateOfBirthDetailsDto custodianDetailsData) {
    de.eshg.base.centralfile.api.person.UpdatePersonWithoutDateOfBirthRequest request =
        AffectedPersonDetailsMapper.mapToUpdatePersonWithoutDateOfBirthRequest(
            custodianDetailsData);

    GetPersonWithoutDateOfBirthResponse response =
        personWithoutDateOfBirthApi.updatePersonWithoutDateOfBirth(id, request);

    return AffectedPersonDetailsMapper.mapToCustodianWithoutDateOfBirthDetailsDto(response);
  }

  public static void deletePersonsWithoutDateOfBirth(
      PersonWithoutDateOfBirthApi api, List<UUID> personIds) {
    if (personIds.isEmpty()) {
      log.info("No persons without date of birth to delete.");
      return;
    }
    log.info("Deleting persons without date of birth {}", personIds);
    api.deletePersonsWithoutDateOfBirth(personIds);
  }
}
