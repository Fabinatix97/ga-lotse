/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import static de.eshg.base.centralfile.mapper.PersonMapper.mapToPersonDiffApi;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.DiffDto;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.person.*;
import de.eshg.base.centralfile.mapper.PersonMapper;
import de.eshg.base.centralfile.persistence.PersonService;
import de.eshg.base.centralfile.persistence.entity.BirthDetails_;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.entity.Person_;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import org.hibernate.Hibernate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Person")
public class PersonController implements PersonApi {

  private static final String PERSON_FILE_STATE_NOT_FOUND = "PersonFileState not found";
  public static final String REFERENCE_PERSON_NOT_FOUND = "ReferencePerson not found";

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
        personService.fuzzySearch(firstName, lastName, dateOfBirth).stream()
            .map(PersonMapper::mapReferencePersonToApi)
            .toList());
  }

  @Override
  @Transactional(readOnly = true)
  public GetReferencePersonResponse getReferencePerson(UUID id) {
    Person referencePerson = findReferencePerson(id);
    return PersonMapper.mapReferencePersonToApi(referencePerson);
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
  public GetPersonFileStatesResponse getPersonFileStates(GetPersonFileStatesRequest request) {
    List<UUID> queryIds = request.fileStateIds().stream().distinct().toList();

    Pageable pageable = toPageableForGetPersonFileStates(request);

    List<Person> personFileStates =
        personRepository.findAllByExternalIdInAndReferencePersonIsNotNull(queryIds, pageable);

    return PersonMapper.mapToGetPersonFileStatesResponse(queryIds, personFileStates, pageable);
  }

  private static Pageable toPageableForGetPersonFileStates(GetPersonFileStatesRequest request) {
    GetPersonFileStatesSortParameters sortParameters = request.sortParameters();
    Sort.Order fallbackSortOrder = Sort.Order.by(Person_.ID);
    if (sortParameters == null) {
      return Pageable.unpaged(Sort.by(fallbackSortOrder));
    }

    Sort.Direction direction = mapSortDirection(sortParameters);
    Sort.Order primarySortAttribute = mapSortKey(sortParameters);

    Sort.Order primarySortOrder = primarySortAttribute.with(direction);

    return PageRequest.of(
        sortParameters.pageNumberOrFallback(0),
        sortParameters.pageSizeOrFallback(25),
        Sort.by(primarySortOrder, fallbackSortOrder.with(direction)));
  }

  private static Sort.Direction mapSortDirection(GetPersonFileStatesSortParameters sortParameters) {
    return switch (sortParameters.sortDirection()) {
      case ASC -> Sort.Direction.ASC;
      case DESC -> Sort.Direction.DESC;
    };
  }

  private static Sort.Order mapSortKey(GetPersonFileStatesSortParameters sortParameters) {
    return switch (sortParameters.sortKey()) {
      case FIRST_NAME -> Sort.Order.by(Person_.FIRST_NAME).ignoreCase();
      case LAST_NAME -> Sort.Order.by(Person_.LAST_NAME).ignoreCase();
      case DATE_OF_BIRTH ->
          Sort.Order.by(Person_.BIRTH_DETAILS + "." + BirthDetails_.DATE_OF_BIRTH);
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
      UUID id, PutPersonRequest request) {
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
  public AddPersonFileStateResponse updateReferencePerson(
      UUID referenceDataId, UpdateReferencePersonRequest request) {
    featureToggle.assertNewFeatureIsEnabled(BaseFeature.VERIFICATION_OF_EXTERNAL_DATA);

    Person referencePersonUpdate = PersonMapper.mapPersonToDm(request);

    Person updatedPersonFileState =
        personService.updateReferencePerson(
            referenceDataId, request.version(), referencePersonUpdate);

    return PersonMapper.mapPersonFileStateToApi(updatedPersonFileState);
  }

  private Person findReferencePerson(UUID id) {
    return personRepository
        .findReferencePersonByFileStateId(id)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Person File State with ID %s (or associated Reference Person) not found"
                        .formatted(id)));
  }

  private static GetPersonFileStateResponse mapPersonToGetPersonFileStateResponse(
      Person personFileState) {
    boolean outdated =
        PersonService.isPersonFileStateOutdated(
            personFileState, personFileState.getReferencePerson());
    return PersonMapper.mapPersonToGetPersonFileStatesResponse(personFileState, outdated);
  }
}
