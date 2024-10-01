/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.client;

import com.google.common.collect.Lists;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.CountryCodeDto;
import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.person.*;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
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
import java.util.stream.Collectors;
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

  public List<UUID> createCustodiansInCentralFile(List<ImportCustodianData> custodianData) {
    List<AddPersonFileStateRequest> requests =
        mapToPersonFileStateRequest(custodianData, DataOrigin.DATA_IMPORT);
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
            centralFileStateId, new PutPersonRequest(updateRequest));
    UUID newCentralFileStateId = response.id();
    Assert.isTrue(
        !newCentralFileStateId.equals(centralFileStateId),
        "Updating a person is expected to generate a new file state."
            + " If this assumption no longer holds, we would need to evict the person cache here.");
    return newCentralFileStateId;
  }

  public AddPersonFileStateResponse createCentralFileStateForReferenceId(
      UUID referenceId, PersonDetailsDto personDetailsDto) {
    return personApi.addPersonFileState(
        new AddPersonFileStateRequest(referenceId, personDetailsDto, DataOriginDto.MANUAL));
  }

  public void markCentralFileStatesForDeletion(UUID... centralFileStates) {
    personApi.markPersonFileStateForDeletion(
        new DeleteFileStatesRequest(
            new LinkedHashSet<>(Arrays.stream(centralFileStates).collect(Collectors.toSet()))));
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
    ChildDetailsData childDetailsData = fetchChildDetailsData(procedure);
    Map<UUID, GetPersonFileStateResponse> custodianFileStates =
        fetchPersonsSingleRequests(procedure.getCustodianIdsFromCentralFile());
    List<CustodianDetailsData> custodianData =
        extractCustodianDetailsData(procedure, custodianFileStates);
    return new ProcedureWithPersonDetailsData(procedure, childDetailsData, custodianData);
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

    Map<UUID, AddPersonFileStateResponse> personsById =
        fetchPersonsBulk(personIdsToFetch, null, null, null, null).stream()
            .collect(StreamUtil.toLinkedHashMap(AddPersonFileStateResponse::id));

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

    Map<UUID, AddPersonFileStateResponse> personsById =
        fetchPersonsBulk(personIdsToFetch, null, null, null, null).stream()
            .collect(StreamUtil.toLinkedHashMap(AddPersonFileStateResponse::id));

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

  public ChildDetailsData fetchChildDetailsData(SchoolEntryProcedure procedure) {
    Person child = procedure.getChild();
    UUID childIdFromCentralFile = child.getCentralFileStateId();
    GetPersonFileStateResponse response = getPersonFileState(childIdFromCentralFile);
    return new ChildDetailsData(
        child.getVersion(),
        childIdFromCentralFile,
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

  public List<AddPersonFileStateResponse> fetchPersonsBulk(
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

  private Map<UUID, GetPersonFileStateResponse> fetchPersonsSingleRequests(
      List<UUID> personIdsToFetch) {
    if (personIdsToFetch.isEmpty()) {
      return Map.of();
    }

    Map<UUID, GetPersonFileStateResponse> responseMap =
        personIdsToFetch.stream()
            .map(this::getPersonFileState)
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));

    if (responseMap.size() != personIdsToFetch.size()) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return responseMap;
  }

  private static ProcedureWithChildData extractChildData(
      SchoolEntryProcedure procedure, Map<UUID, AddPersonFileStateResponse> personsById) {
    AddPersonFileStateResponse child = personsById.get(procedure.getChildIdFromCentralFile());
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

  private static List<CustodianDetailsData> extractCustodianDetailsData(
      SchoolEntryProcedure procedure, Map<UUID, GetPersonFileStateResponse> personsById) {
    return procedure.getCustodianIdsFromCentralFile().stream()
        .map(personsById::get)
        .map(
            custodian ->
                new CustodianDetailsData(
                    custodian.referenceVersion(),
                    custodian.id(),
                    custodian.outdated(),
                    custodian.title(),
                    custodian.salutation(),
                    custodian.gender(),
                    custodian.firstName(),
                    custodian.lastName(),
                    custodian.dateOfBirth(),
                    custodian.nameAtBirth(),
                    custodian.placeOfBirth(),
                    custodian.countryOfBirth(),
                    custodian.emailAddresses(),
                    custodian.phoneNumbers(),
                    custodian.contactAddress(),
                    custodian.differentBillingAddress()))
        .toList();
  }

  public UUID updateChild(UUID fileStateId, UpdatePersonRequest request) {
    return updatePersonFileStateAndReference(
        fileStateId, PersonMapper.mapToPersonDetailsDto(request));
  }

  public UUID updateChild(
      SchoolEntryProcedure procedure,
      String placeOfBirth,
      CountryCodeDto countryOfBirth,
      String phoneNumber) {

    UUID existingFileStateId = procedure.getChildIdFromCentralFile();
    GetPersonFileStateResponse child = getPersonFileState(existingFileStateId);

    if ((placeOfBirth == null || Objects.equals(child.placeOfBirth(), placeOfBirth))
        && (countryOfBirth == null || Objects.equals(child.countryOfBirth(), countryOfBirth))
        && (phoneNumber == null || child.phoneNumbers().contains(phoneNumber))) {
      return existingFileStateId;
    }

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

    return updatePersonFileStateAndReference(existingFileStateId, updatedChildData);
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
