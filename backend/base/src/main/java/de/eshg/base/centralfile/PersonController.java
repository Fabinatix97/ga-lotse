/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import static de.eshg.base.centralfile.mapper.PersonMapper.mapToPersonDiffApi;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.DiffDto;
import de.eshg.base.centralfile.api.GetFileStateIdsBulkRequest;
import de.eshg.base.centralfile.api.GetFileStateIdsBulkResponse;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.person.*;
import de.eshg.base.centralfile.mapper.PersonMapper;
import de.eshg.base.centralfile.persistence.AssociatedFileStateIds;
import de.eshg.base.centralfile.persistence.PersonService;
import de.eshg.base.centralfile.persistence.ReferencePersonsUpdate;
import de.eshg.base.centralfile.persistence.entity.BirthDetails_;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.entity.Person_;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Person")
public class PersonController implements PersonApi {

  private static final Logger log = LoggerFactory.getLogger(PersonController.class);

  private static final String PERSON_FILE_STATE_NOT_FOUND = "PersonFileState not found";
  public static final String REFERENCE_PERSON_NOT_FOUND = "ReferencePerson not found";

  private static final int MAX_RESULTS_FOR_PERSON_SEARCH_WITH_PARTIAL_KNOWLEDGE_FACTORS = 100;

  private final PersonRepository personRepository;
  private final PersonService personService;
  private final Clock clock;
  private final BaseFeatureToggle featureToggle;

  public PersonController(
      PersonRepository personRepository,
      PersonService personService,
      BaseFeatureToggle featureToggle,
      Clock clock) {
    this.personRepository = personRepository;
    this.personService = personService;
    this.featureToggle = featureToggle;
    this.clock = clock;
  }

  @Override
  @Transactional
  public AddPersonFileStateResponse addPersonFileState(AddPersonFileStateRequest request) {
    Person personFileState = PersonMapper.mapPersonToDm(request);
    Person savedPersonFileState =
        personService.addPersonFileState(personFileState, request.referencePersonId());
    return PersonMapper.mapPersonFileStateToApi(savedPersonFileState);
  }

  @Override
  @Transactional
  public AddPersonFileStatesResponse addPersonFileStates(AddPersonFileStatesRequest request) {
    List<Person> personsToAdd =
        request.persons().stream().map(PersonMapper::mapPersonToDm).toList();

    List<UUID> personFileStateIds = personService.addPersonFileStates(personsToAdd);

    return new AddPersonFileStatesResponse(personFileStateIds);
  }

  @Override
  @Transactional(readOnly = true)
  public GetPersonFileStateResponse getPersonFileState(UUID id) {
    Person person =
        personRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(PERSON_FILE_STATE_NOT_FOUND));
    return mapPersonToGetPersonFileStateResponse(person);
  }

  @Override
  @Transactional(readOnly = true)
  public SearchReferencePersonsResponse searchReferencePersons(
      String firstName, String lastName, LocalDate dateOfBirth) {
    return new SearchReferencePersonsResponse(
        personService.fuzzySearch(firstName, lastName, dateOfBirth, false, null).stream()
            .map(PersonMapper::mapReferencePersonToApi)
            .toList());
  }

  @Override
  @Transactional(readOnly = true)
  public SearchReferencePersonsResponse searchReferencePersonsByHumanReadableId(
      String humanReadableId) {
    return new SearchReferencePersonsResponse(
        personService.searchReferencePersonsByHumanReadableId(humanReadableId).stream()
            .map(PersonMapper::mapReferencePersonToApi)
            .toList());
  }

  @Override
  @Transactional(readOnly = true)
  public SearchReferencePersonsWithPartialKnowledgeFactorsResponse
      searchReferencePersonsWithPartialKnowledgeFactors(
          String firstName, String lastName, LocalDate dateOfBirth) {
    List<Person> fuzzySearchResult =
        personService.fuzzySearch(
            firstName,
            lastName,
            dateOfBirth,
            true,
            MAX_RESULTS_FOR_PERSON_SEARCH_WITH_PARTIAL_KNOWLEDGE_FACTORS + 1);
    boolean overflow =
        fuzzySearchResult.size() > MAX_RESULTS_FOR_PERSON_SEARCH_WITH_PARTIAL_KNOWLEDGE_FACTORS;
    return new SearchReferencePersonsWithPartialKnowledgeFactorsResponse(
        fuzzySearchResult.stream()
            .limit(MAX_RESULTS_FOR_PERSON_SEARCH_WITH_PARTIAL_KNOWLEDGE_FACTORS)
            .map(PersonMapper::mapReferencePersonToApi)
            .toList(),
        overflow);
  }

  @Override
  @Transactional(readOnly = true)
  public GetReferencePersonResponse getReferencePerson(UUID id) {
    Person referencePerson = findReferencePerson(id);
    return PersonMapper.mapReferencePersonToApi(referencePerson);
  }

  @Override
  @Transactional(readOnly = true)
  public GetReferencePersonsResponse getReferencePersons(List<UUID> personIds) {
    List<Person> personsWithReferencePerson = fetchPersonsWithReferencePerson(personIds);
    Map<UUID, GetReferencePersonResponse> responses =
        personsWithReferencePerson.stream()
            .collect(
                Collectors.toMap(
                    person -> person.getExternalId(),
                    person -> PersonMapper.mapReferencePersonToApi(person.getReferencePerson())));
    return new GetReferencePersonsResponse(responses);
  }

  @Override
  @Transactional(readOnly = true)
  public GetFileStateIdsResponse getPersonFileStateIdsAssociatedWithFileState(UUID id) {
    Person fileState =
        personRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(PERSON_FILE_STATE_NOT_FOUND));

    return findAllLinkedFileStates(fileState.getReferencePerson().getId());
  }

  @Override
  @Transactional(readOnly = true)
  public GetFileStateIdsBulkResponse getPersonFileStateIdsAssociatedWithFileStates(
      GetFileStateIdsBulkRequest request) {
    List<AssociatedFileStateIds> associatedFileStateIds =
        personRepository.findAllAssociatedFileStateIdsByFileStateIds(request.fileStateIds());
    GetFileStateIdsBulkResponse response =
        PersonMapper.mapToFileStateIdsBulkResponse(associatedFileStateIds);

    if (associatedFileStateIds.size() < request.fileStateIds().size()) {
      Map<UUID, List<UUID>> foundFileStateIdsMap = response.fileStateIds();
      List<UUID> notFoundFileStateIds =
          request.fileStateIds().stream()
              .filter(fileStateId -> !foundFileStateIdsMap.containsKey(fileStateId))
              .toList();
      throw new NotFoundException(
          "Number of file state ids not found: " + notFoundFileStateIds.size(),
          "File state ids not found: " + notFoundFileStateIds);
    }

    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public GetFileStateIdsResponse getPersonFileStateIdsAssociatedWithReferencePerson(UUID id) {
    Person referencePerson =
        personRepository
            .findByExternalIdEqualsAndReferencePersonIsNull(id)
            .orElseThrow(() -> new NotFoundException(REFERENCE_PERSON_NOT_FOUND));

    return findAllLinkedFileStates(referencePerson.getId());
  }

  private GetFileStateIdsResponse findAllLinkedFileStates(Long referenceId) {
    List<UUID> searchResultsFromDb =
        personRepository.findAllByReferencePersonIdOrderById(referenceId);
    return new GetFileStateIdsResponse(searchResultsFromDb);
  }

  @Override
  @Transactional(readOnly = true)
  public GetPersonFileStateIdsByKeyAttributesResponse
      getPersonFileStateIdsByReferencePersonKeyAttributes(
          GetPersonFileStateIdsByKeyAttributesRequest request) {
    List<Person> referencePersons =
        personService.findReferencePersonsByKeyAttributes(request.searchAttributes());

    Map<PersonKeyAttributes, List<UUID>> result = new LinkedHashMap<>();
    for (Person referencePerson : referencePersons) {
      PersonKeyAttributes key =
          new PersonKeyAttributes(
              referencePerson.getFirstName(),
              referencePerson.getLastName(),
              referencePerson.getBirthDetails().dateOfBirth());
      result.put(
          key, personRepository.findAllByReferencePersonIdOrderById(referencePerson.getId()));
    }
    return new GetPersonFileStateIdsByKeyAttributesResponse(result);
  }

  @Override
  @Transactional(readOnly = true)
  public GetPersonFileStatesResponse getPersonFileStates(GetPersonFileStatesRequest request) {
    List<UUID> queryIds = request.fileStateIds().stream().distinct().toList();

    Pageable pageable = toPageableForGetPersonFileStates(request);
    List<Person> personFileStates;
    Map<UUID, Boolean> outdatedByFileStateId = Collections.emptyMap();

    if (Boolean.TRUE.equals(request.checkOutdated())) {
      personFileStates =
          personRepository.findAllByExternalIdInAndReferencePersonIsNotNull(
              new HashSet<>(queryIds), pageable);

      outdatedByFileStateId =
          personFileStates.stream()
              .collect(
                  Collectors.toMap(
                      Person::getExternalId,
                      personFileState ->
                          PersonService.isPersonFileStateOutdated(
                              personFileState, personFileState.getReferencePerson())));
    } else {
      personFileStates =
          personRepository.findAllFetchingReferenceByExternalIdInAndReferencePersonIsNotNull(
              queryIds, pageable);
    }

    return PersonMapper.mapToGetPersonFileStatesResponse(
        queryIds, personFileStates, pageable, outdatedByFileStateId);
  }

  private static Pageable toPageableForGetPersonFileStates(GetPersonFileStatesRequest request) {
    GetPersonFileStatesSortParameters sortParameters = request.sortParameters();
    Sort.Order fallbackSortOrder = Sort.Order.by(Person_.ID);
    if (sortParameters == null) {
      return Pageable.unpaged(Sort.by(fallbackSortOrder));
    }

    Sort sort = Sort.by(getSortOrderOrders(sortParameters, fallbackSortOrder));

    return PageRequest.of(
        sortParameters.pageNumberOrFallback(0), sortParameters.pageSizeOrFallback(25), sort);
  }

  private static List<Sort.Order> getSortOrderOrders(
      GetPersonFileStatesSortParameters sortParameters, Sort.Order fallbackSortOrder) {
    List<Sort.Order> primarySortAttribute = mapSortKey(sortParameters);

    List<Sort.Order> sortOrders = new ArrayList<>(primarySortAttribute);
    sortOrders.add(fallbackSortOrder);

    Sort.Direction direction = mapSortDirection(sortParameters);
    return sortOrders.stream().map(order -> order.with(direction)).toList();
  }

  private static Sort.Direction mapSortDirection(GetPersonFileStatesSortParameters sortParameters) {
    return switch (sortParameters.sortDirection()) {
      case ASC -> Sort.Direction.ASC;
      case DESC -> Sort.Direction.DESC;
    };
  }

  private static List<Sort.Order> mapSortKey(GetPersonFileStatesSortParameters sortParameters) {
    Sort.Order firstName = Sort.Order.by(Person_.FIRST_NAME).ignoreCase();
    Sort.Order lastName = Sort.Order.by(Person_.LAST_NAME).ignoreCase();
    Sort.Order dateOfBirth =
        Sort.Order.by(Person_.BIRTH_DETAILS + "." + BirthDetails_.DATE_OF_BIRTH);
    return switch (sortParameters.sortKey()) {
      case FIRST_NAME -> List.of(firstName, lastName, dateOfBirth);
      case LAST_NAME -> List.of(lastName, firstName, dateOfBirth);
      case DATE_OF_BIRTH -> List.of(dateOfBirth, lastName, firstName);
    };
  }

  @Override
  @Transactional
  public void markPersonFileStateForDeletion(DeleteFileStatesRequest list) {
    personService.markAllForDeletionAt(
        list.fileStateIds(), Instant.now(clock).plus(Duration.ofDays(365)));
  }

  @Override
  @Transactional
  public void deletePersonFileStateDuringArchive(DeleteFileStatesRequest list) {
    personService.markAllForDeletionAt(list.fileStateIds(), Instant.now(clock));
  }

  @Override
  @Transactional
  public AddPersonFileStateResponse updatePersonFileStateAndReference(
      UUID id, UpdatePersonRequest request) {
    Person fileState =
        personRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(PERSON_FILE_STATE_NOT_FOUND));

    Person fileStateUpdate = PersonMapper.mapPersonToDm(request);
    Person savedFileStateUpdate =
        personService.updateFileStateAndReferencePerson(fileState, fileStateUpdate);

    return PersonMapper.mapPersonFileStateToApi(savedFileStateUpdate);
  }

  @Override
  @Transactional
  public AddPersonFileStateResponse syncFileState(UUID id, SyncFileStateRequest request) {
    Person fileState =
        personRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(PERSON_FILE_STATE_NOT_FOUND));

    Person savedFileStateUpdate = personService.syncFileState(fileState, request.version());

    return PersonMapper.mapPersonFileStateToApi(savedFileStateUpdate);
  }

  @Override
  @Transactional
  public AddPersonFileStateResponse addPersonFromExternalSource(
      ExternalAddPersonFileStateRequest request) {
    Person personFileState = PersonMapper.mapPersonToDm(request);
    Person savedPersonFileState = personService.addPersonFromExternalSource(personFileState);

    return PersonMapper.mapPersonFileStateToApi(savedPersonFileState);
  }

  @Override
  @Transactional(readOnly = true)
  public GetPersonDiffResponse getPersonDiff(UUID id) {
    Person person =
        personRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(PERSON_FILE_STATE_NOT_FOUND));
    Person refPerson = Hibernate.unproxy(person.getReferencePerson(), Person.class);

    DiffDto<PersonDetailsDto> personDetailsDiffDto = mapToPersonDiffApi(person, refPerson);
    DiffDto<AddressDto> contactAddressDiffDto =
        AddressMapper.mapAddressDiffToApi(
            person.getContactAddress(), refPerson.getContactAddress());
    DiffDto<AddressDto> billingAddressDiffDto =
        AddressMapper.mapAddressDiffToApi(
            person.getDifferentBillingAddress(), refPerson.getDifferentBillingAddress());

    return new GetPersonDiffResponse(
        refPerson.getVersion(), personDetailsDiffDto, contactAddressDiffDto, billingAddressDiffDto);
  }

  @Override
  @Transactional
  public UpdatePersonsResponse updatePersonFileStatesAndReferences(UpdatePersonsRequest request) {
    Map<UUID, Person> fileStateUpdatesById = collectUpdatesByFileStateId(request);
    return personService.updateFileStatesAndReferencesInBulk(fileStateUpdatesById);
  }

  private static Map<UUID, Person> collectUpdatesByFileStateId(UpdatePersonsRequest request) {
    Map<UUID, Person> fileStateUpdatesById = new LinkedHashMap<>();
    for (UpdatePersonInBulkRequest updateRequest : request.updateRequests()) {
      UUID filedStateId = updateRequest.fileStateId();
      Person newFileState = PersonMapper.mapPersonToDm(updateRequest);
      if (fileStateUpdatesById.putIfAbsent(filedStateId, newFileState) != null) {
        throw new BadRequestException(
            "File state with id " + filedStateId + " is updated more than once");
      }
    }
    return fileStateUpdatesById;
  }

  @Override
  @Transactional
  public AddPersonFileStateResponse updateReferencePerson(
      UUID referenceDataId, UpdateReferencePersonRequest request) {
    Person referencePersonUpdate = PersonMapper.mapPersonToDm(request);

    Person updatedPersonFileState =
        personService.updateReferencePerson(
            referenceDataId, request.version(), referencePersonUpdate);

    return PersonMapper.mapPersonFileStateToApi(updatedPersonFileState);
  }

  @Override
  @Transactional
  public UpdatePersonsResponse updateReferencePersons(UpdateReferencePersonsRequest request) {
    List<ReferencePersonsUpdate> personsUpdateList =
        request.updateRequests().stream()
            .map(
                person -> {
                  Person referencePersonUpdate = PersonMapper.mapPersonToDm(person.personDetails());
                  return new ReferencePersonsUpdate(
                      person.referencePersonId(),
                      person.latestFileStateId(),
                      person.version(),
                      referencePersonUpdate);
                })
            .toList();
    return personService.updateReferencePersonsInBulk(personsUpdateList);
  }

  private Person findReferencePerson(UUID id) {
    return personRepository
        .findReferencePersonByFileStateId(id)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Person File State with given ID (or associated Reference Person) not found"));
  }

  private List<Person> fetchPersonsWithReferencePerson(List<UUID> ids) {
    return personRepository.findAllByExternalIdInAndReferencePersonIsNotNullOrderById(ids);
  }

  public static GetPersonFileStateResponse mapPersonToGetPersonFileStateResponse(
      Person personFileState) {
    boolean outdated =
        PersonService.isPersonFileStateOutdated(
            personFileState, personFileState.getReferencePerson());
    return PersonMapper.mapPersonToGetPersonFileStateResponse(personFileState, outdated);
  }
}
