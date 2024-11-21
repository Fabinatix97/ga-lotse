/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.client;

import com.google.common.collect.Lists;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.person.*;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import de.eshg.schoolentry.api.CreatePersonDto;
import de.eshg.schoolentry.api.UpdatePersonRequest;
import de.eshg.schoolentry.business.model.*;
import de.eshg.schoolentry.domain.model.Person;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.mapper.PersonMapper;
import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Stream;
import org.jetbrains.annotations.VisibleForTesting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.annotation.RequestScope;

@RequestScope
@Component
public class PersonClient {

  private static final Logger log = LoggerFactory.getLogger(PersonClient.class);

  // Needs to be aligned with the constraint of AddPersonFileStatesRequest.persons
  private static final int MAX_PERSONS_PER_BATCH = 10_000;

  private final PersonApi personApi;
  private final Map<UUID, GetPersonFileStateResponse> personCache = new ConcurrentHashMap<>();

  public PersonClient(PersonApi personApi) {
    this.personApi = personApi;
  }

  public List<ProcedureIds> createPersonsInCentralFile(
      List<ImportProcedureData> procedureData, DataOrigin dataOrigin) {
    if (procedureData.isEmpty()) {
      return List.of();
    }

    log.info("Creating persons in the central file");

    List<AddPersonFileStateRequest> personsToAdd = mapToFlatRequestList(procedureData, dataOrigin);

    List<UUID> ids =
        Lists.partition(personsToAdd, MAX_PERSONS_PER_BATCH).stream()
            .flatMap(
                personsToAddPartition -> {
                  AddPersonFileStatesRequest request =
                      new AddPersonFileStatesRequest(personsToAddPartition);

                  AddPersonFileStatesResponse response = personApi.addPersonFileStates(request);
                  return response.personFileStateIds().stream();
                })
            .toList();

    log.info(
        "Created {} persons in the central file with IDs={}",
        ids.size(),
        shortenForLoggingIfNecessary(ids));

    return mapFromFlatResponseList(procedureData, ids);
  }

  @VisibleForTesting
  static List<?> shortenForLoggingIfNecessary(List<?> elements) {
    if (elements.size() <= 20) {
      return elements;
    } else {
      List<Object> shortenedList = new ArrayList<>(elements.subList(0, 10));
      shortenedList.add("…");
      shortenedList.addAll(elements.subList(elements.size() - 10, elements.size()));
      return shortenedList;
    }
  }

  public UUID createPersonInCentralFile(CreatePersonDto personDetailsData) {
    AddPersonFileStateRequest request =
        new AddPersonFileStateRequest(
            PersonMapper.mapToPersonDetailsDto(personDetailsData), DataOriginDto.MANUAL);

    log.info("Creating person in the central file");

    AddPersonFileStateResponse response = personApi.addPersonFileState(request);
    UUID id = response.id();

    log.info("Created person in the central file with ID={}", id);

    return id;
  }

  public List<UUID> createCustodiansInCentralFile(List<ImportCustodianData> custodians) {
    List<AddPersonFileStateRequest> requests =
        mapToPersonFileStateRequest(custodians, DataOrigin.DATA_IMPORT);
    AddPersonFileStatesResponse response =
        personApi.addPersonFileStates(new AddPersonFileStatesRequest(requests));
    return response.personFileStateIds();
  }

  public UUID updatePersonInCentralFile(UpdatePersonRequest custodian, UUID centralFileStateId) {
    return updatePersonFileStateAndReference(
        centralFileStateId, PersonMapper.mapToPersonDetailsDto(custodian));
  }

  private UUID updatePersonFileStateAndReference(
      UUID centralFileStateId, PersonDetailsDto updateRequest) {
    AddPersonFileStateResponse response =
        personApi.updatePersonFileStateAndReference(
            centralFileStateId,
            new de.eshg.base.centralfile.api.person.UpdatePersonRequest(updateRequest));
    UUID newCentralFileStateId = response.id();
    if (newCentralFileStateId.equals(centralFileStateId)) {
      log.info(
          "Updating the person did not generate a new file state ID. There was probably nothing to update.");
    }
    return newCentralFileStateId;
  }

  public AddPersonFileStateResponse createCentralFileStateForReferenceId(
      UUID referenceId, PersonDetailsDto personDetailsDto) {
    return personApi.addPersonFileState(
        new AddPersonFileStateRequest(referenceId, personDetailsDto, DataOriginDto.MANUAL));
  }

  public void markCentralFileStatesForDeletion(UUID... centralFileStates) {
    personApi.markPersonFileStateForDeletion(new DeleteFileStatesRequest(centralFileStates));
  }

  private static List<AddPersonFileStateRequest> mapToFlatRequestList(
      List<ImportProcedureData> procedureData, DataOrigin dataOrigin) {
    return procedureData.stream()
        .flatMap(
            procedure ->
                Stream.concat(
                    Stream.of(mapToPersonFileStateRequest(procedure.child(), dataOrigin)),
                    mapToPersonFileStateRequest(procedure.custodians(), dataOrigin).stream()))
        .toList();
  }

  private static List<ProcedureIds> mapFromFlatResponseList(
      List<ImportProcedureData> procedureData, List<UUID> ids) {
    Iterator<UUID> idIterator = ids.iterator();
    return procedureData.stream()
        .map(
            procedure -> {
              UUID childId = idIterator.next();
              List<UUID> custodianIds =
                  procedure.custodians().stream().map(custodian -> idIterator.next()).toList();

              return new ProcedureIds(childId, custodianIds);
            })
        .toList();
  }

  private static AddPersonFileStateRequest mapToPersonFileStateRequest(
      CreatePersonDto person, DataOrigin dataOrigin) {
    return new AddPersonFileStateRequest(
        person.referenceId(), PersonMapper.mapToPersonDetailsDto(person), mapToDto(dataOrigin));
  }

  private static List<AddPersonFileStateRequest> mapToPersonFileStateRequest(
      List<ImportCustodianData> custodians, DataOrigin dataOrigin) {
    if (custodians.isEmpty()) {
      return List.of();
    }

    return custodians.stream()
        .map(custodian -> mapToPersonFileStateRequest(custodian, dataOrigin))
        .toList();
  }

  private static AddPersonFileStateRequest mapToPersonFileStateRequest(
      ImportCustodianData custodian, DataOrigin dataOrigin) {
    return new AddPersonFileStateRequest(
        PersonMapper.mapToPersonDetailsDto(custodian), mapToDto(dataOrigin));
  }

  private static DataOriginDto mapToDto(DataOrigin dataOrigin) {
    return switch (dataOrigin) {
      case MANUAL_CREATION -> DataOriginDto.MANUAL;
      case DATA_IMPORT -> DataOriginDto.IMPORT;
    };
  }

  public ProcedureWithPersonDetailsData augmentWithPersonDetails(SchoolEntryProcedure procedure) {
    List<UUID> fileStateIds =
        procedure.getRelatedPersons().stream().map(RelatedPerson::getCentralFileStateId).toList();

    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(fileStateIds, true));

    if (response.personFileStates().size() != fileStateIds.size()) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    Map<UUID, GetPersonFileStateResponse> fileStatesById =
        response.personFileStates().stream()
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));

    List<PersonDetailsData> custodianDetails =
        procedure
            .getCustodians()
            .map(custodian -> extractDetails(custodian, fileStatesById))
            .toList();

    PersonDetailsData childDetails = extractDetails(procedure.getChild(), fileStatesById);

    return new ProcedureWithPersonDetailsData(procedure, childDetails, custodianDetails);
  }

  PersonDetailsData extractDetails(
      Person person, Map<UUID, GetPersonFileStateResponse> fileStatesById) {
    GetPersonFileStateResponse fileState = fileStatesById.get(person.getCentralFileStateId());
    return mapFileStateToPersonDetailsData(person, fileState);
  }

  private static PersonDetailsData mapFileStateToPersonDetailsData(
      Person person, GetPersonFileStateResponse response) {
    return new PersonDetailsData(
        person.getVersion(),
        response.id(),
        response.outdated(),
        response.title(),
        response.salutation(),
        response.gender(),
        response.firstName(),
        response.lastName(),
        response.dateOfBirth(),
        response.nameAtBirth(),
        response.placeOfBirth(),
        response.countryOfBirth(),
        response.emailAddresses(),
        response.phoneNumbers(),
        response.contactAddress(),
        response.differentBillingAddress());
  }

  public Map<PersonKeyAttributes, List<ProcedureWithChildData>> augmentWithChildData(
      Map<PersonKeyAttributes, List<SchoolEntryProcedure>> proceduresByPerson) {
    if (proceduresByPerson.isEmpty()) {
      return Map.of();
    }

    List<UUID> personIdsToFetch =
        proceduresByPerson.values().stream()
            .flatMap(Collection::stream)
            .map(SchoolEntryProcedure::getChildIdFromCentralFile)
            .toList();

    Map<UUID, GetPersonFileStateResponse> personsById =
        fetchPersonsBulk(personIdsToFetch, null, null, null, null).stream()
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));

    Map<PersonKeyAttributes, List<ProcedureWithChildData>> result = new LinkedHashMap<>();
    for (Entry<PersonKeyAttributes, List<SchoolEntryProcedure>> entry :
        proceduresByPerson.entrySet()) {
      List<ProcedureWithChildData> augmentedProcedures =
          entry.getValue().stream()
              .map(procedure -> extractChildData(procedure, personsById))
              .toList();
      result.put(entry.getKey(), augmentedProcedures);
    }
    return result;
  }

  public Stream<ProcedureWithChildData> augmentWithChildData(
      List<SchoolEntryProcedure> procedures) {
    if (procedures.isEmpty()) {
      return Stream.empty();
    }

    List<UUID> personIdsToFetch =
        procedures.stream().map(SchoolEntryProcedure::getChildIdFromCentralFile).toList();

    Map<UUID, GetPersonFileStateResponse> personsById =
        fetchPersonsBulk(personIdsToFetch, null, null, null, null).stream()
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));

    return procedures.stream().map(procedure -> extractChildData(procedure, personsById));
  }

  public ChildData fetchChildData(SchoolEntryProcedure procedure) {
    GetPersonFileStateResponse response = getPersonFileState(procedure.getChildIdFromCentralFile());
    return new ChildData(
        response.firstName(),
        response.lastName(),
        response.dateOfBirth(),
        response.placeOfBirth(),
        response.countryOfBirth(),
        response.gender(),
        response.contactAddress(),
        response.phoneNumbers());
  }

  private GetPersonFileStateResponse getPersonFileState(UUID id) {
    return personCache.computeIfAbsent(id, personApi::getPersonFileState);
  }

  public List<GetPersonFileStateResponse> fetchPersonsBulk(
      List<UUID> personIdsToFetch,
      GetPersonsSortKey sortKey,
      Sort.Direction direction,
      Integer pageNumber,
      Integer pageSize) {
    if (personIdsToFetch.isEmpty()) {
      return List.of();
    }

    GetPersonFileStatesSortParameters sortParameters =
        mapToSortParameters(sortKey, direction, pageNumber, pageSize);

    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(
            new GetPersonFileStatesRequest(personIdsToFetch, sortParameters));

    if (sortParameters == null && response.personFileStates().size() != personIdsToFetch.size()) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return response.personFileStates();
  }

  private static GetPersonFileStatesSortParameters mapToSortParameters(
      GetPersonsSortKey sortKey, Sort.Direction direction, Integer pageNumber, Integer pageSize) {
    if (sortKey == null) {
      return null;
    }
    return new GetPersonFileStatesSortParameters(
        sortKey,
        switch (direction) {
          case ASC -> SortDirection.ASC;
          case DESC -> SortDirection.DESC;
        },
        pageNumber,
        pageSize);
  }

  private static ProcedureWithChildData extractChildData(
      SchoolEntryProcedure procedure, Map<UUID, GetPersonFileStateResponse> personsById) {
    GetPersonFileStateResponse child = personsById.get(procedure.getChildIdFromCentralFile());
    ChildData childData =
        new ChildData(
            child.firstName(),
            child.lastName(),
            child.dateOfBirth(),
            child.placeOfBirth(),
            child.countryOfBirth(),
            child.gender(),
            child.contactAddress(),
            child.phoneNumbers());

    return new ProcedureWithChildData(procedure, childData);
  }

  public UUID updateChild(UUID fileStateId, UpdatePersonRequest request) {
    return updatePersonFileStateAndReference(
        fileStateId, PersonMapper.mapToPersonDetailsDto(request));
  }

  public List<UUID> updateChildren(List<ResolvedMergeProcedureData> mergeDataList) {
    if (mergeDataList.isEmpty()) {
      return List.of();
    }

    List<UUID> childIds =
        mergeDataList.stream()
            .map(ResolvedMergeProcedureData::procedure)
            .map(SchoolEntryProcedure::getChildIdFromCentralFile)
            .toList();
    Map<UUID, GetPersonFileStateResponse> existingFileStates = getPersonFileStates(childIds);

    List<UpdatePersonInBulkRequest> updates = new ArrayList<>();
    Map<UUID, SchoolEntryProcedure> updatedProceduresByChildId = new LinkedHashMap<>();

    for (ResolvedMergeProcedureData childUpdate : mergeDataList) {
      SchoolEntryProcedure procedure = childUpdate.procedure();
      UUID childIdFromCentralFile = procedure.getChildIdFromCentralFile();
      GetPersonFileStateResponse child = existingFileStates.get(childIdFromCentralFile);
      String placeOfBirth = childUpdate.placeOfBirth();
      CountryCode countryOfBirth = childUpdate.countryOfBirth();
      String phoneNumber = childUpdate.phoneNumber();

      if ((placeOfBirth != null && !Objects.equals(child.placeOfBirth(), placeOfBirth))
          || (countryOfBirth != null && !Objects.equals(child.countryOfBirth(), countryOfBirth))
          || (phoneNumber != null && !child.phoneNumbers().contains(phoneNumber))) {
        List<String> phoneNumbers = new ArrayList<>(child.phoneNumbers());
        if (phoneNumber != null && !child.phoneNumbers().contains(phoneNumber)) {
          phoneNumbers.add(phoneNumber);
        }

        PersonDetailsDto updatedChildData =
            new PersonDetailsDto(
                child.title(),
                child.salutation(),
                child.gender(),
                child.firstName(),
                child.lastName(),
                child.dateOfBirth(),
                child.nameAtBirth(),
                Optional.ofNullable(placeOfBirth).orElse(child.placeOfBirth()),
                Optional.ofNullable(countryOfBirth).orElse(child.countryOfBirth()),
                child.emailAddresses(),
                phoneNumbers,
                child.contactAddress(),
                child.differentBillingAddress());

        updates.add(new UpdatePersonInBulkRequest(childIdFromCentralFile, updatedChildData));
        updatedProceduresByChildId.put(childIdFromCentralFile, procedure);
      }
    }

    if (updates.isEmpty()) {
      return List.of();
    }

    UpdatePersonsResponse response =
        personApi.updatePersonFileStatesAndReferences(new UpdatePersonsRequest(updates));
    List<UUID> failedPersonIds = response.failedPersonIds();

    if (!failedPersonIds.isEmpty()) {
      log.error(
          "Failed to update {} person(s): {}",
          failedPersonIds.size(),
          shortenForLoggingIfNecessary(failedPersonIds));
    }

    for (UpdatePersonInBulkResult result : response.results()) {
      UUID previousCentralFileStateId = result.previousFileStateId();
      UUID newCentralFileStateId = result.newFileStateId();
      SchoolEntryProcedure procedure = updatedProceduresByChildId.get(previousCentralFileStateId);
      procedure.getChild().setCentralFileStateId(newCentralFileStateId);
    }

    return resolveProcedureIds(failedPersonIds, updatedProceduresByChildId);
  }

  private Map<UUID, GetPersonFileStateResponse> getPersonFileStates(List<UUID> personFileStateIds) {
    return personApi
        .getPersonFileStates(new GetPersonFileStatesRequest(personFileStateIds))
        .personFileStates()
        .stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  private static List<UUID> resolveProcedureIds(
      List<UUID> childIds, Map<UUID, SchoolEntryProcedure> proceduresByChildId) {
    return childIds.stream()
        .map(
            failedPersonId -> {
              SchoolEntryProcedure procedure = proceduresByChildId.get(failedPersonId);
              Assert.notNull(
                  procedure,
                  () ->
                      "Failed to find updated procedure for person ID %s"
                          .formatted(failedPersonId));
              return procedure.getExternalId();
            })
        .toList();
  }

  public UUID syncPerson(UUID fileStateId, long referenceVersion) {
    try {
      AddPersonFileStateResponse response =
          personApi.syncFileState(fileStateId, new SyncFileStateRequest(referenceVersion));
      return response.id();
    } catch (HttpClientErrorException.BadRequest e) {
      ErrorResponse body = e.getResponseBodyAs(ErrorResponse.class);
      if (body != null && ErrorCode.CONFLICT.equals(body.errorCode())) {
        throw new BadRequestException(
            ErrorCode.CONFLICT, "Conflict in central file: %s".formatted(body.message()));
      }
      throw e;
    }
  }
}
