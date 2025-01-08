/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import static de.eshg.base.centralfile.PersonController.REFERENCE_PERSON_NOT_FOUND;
import static de.eshg.base.util.PersonDiffer.isPersonMatch;
import static de.eshg.base.util.SearchSpecificationUtil.getSimilarityThreshold;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.CentralFileAuditLogger;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.base.centralfile.api.person.UpdatePersonInBulkResult;
import de.eshg.base.centralfile.api.person.UpdatePersonsResponse;
import de.eshg.base.centralfile.persistence.entity.BirthDetails_;
import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.entity.Person_;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.util.FuzzySearchHelper;
import de.eshg.base.util.PersonDiffer;
import de.eshg.mutex.MutexService;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class PersonService {
  private static final Logger log = LoggerFactory.getLogger(PersonService.class);
  public static final String MUTEX_PERSON_WRITE = "PERSON_WRITE";
  private final PersonRepository personRepository;
  private final FuzzySearchHelper fuzzySearchHelper;
  private final MutexService mutexService;
  private final CentralFileAuditLogger logger;
  private final Clock clock;

  public PersonService(
      PersonRepository personRepository,
      MutexService mutexService,
      FuzzySearchHelper fuzzySearchHelper,
      CentralFileAuditLogger logger,
      Clock clock) {
    this.personRepository = personRepository;
    this.mutexService = mutexService;
    this.fuzzySearchHelper = fuzzySearchHelper;
    this.logger = logger;
    this.clock = clock;
  }

  public static boolean isPersonFileStateOutdated(Person personFileState, Person referencePerson) {
    return !isPersonMatch(personFileState, referencePerson);
  }

  public Person addPersonFileState(Person personFileState, UUID referencePersonId) {
    return mutexService.doWithLockedMutex(
        MUTEX_PERSON_WRITE, () -> addPersonFileStateWhenLocked(personFileState, referencePersonId));
  }

  private Person addPersonFileStateWhenLocked(Person personFileState, UUID referencePersonId) {
    Person referencePerson =
        findOrAddReferencePersonForAddPersonFileState(personFileState, referencePersonId);

    return addPersonFileState(personFileState, referencePerson);
  }

  private Person findOrAddReferencePersonForAddPersonFileState(
      Person personFileState, UUID referencePersonId) {

    if (referencePersonId != null) {
      return getReferencePerson(referencePersonId);
    } else {
      return findMatchingReferencePerson(personFileState)
          .orElseGet(() -> addPersonForFileState(personFileState));
    }
  }

  public Person getReferencePerson(UUID referencePersonId) {
    return personRepository
        .findByExternalIdEqualsAndReferencePersonIsNull(referencePersonId)
        .orElseThrow(() -> new NotFoundException(REFERENCE_PERSON_NOT_FOUND));
  }

  private Person addPersonFileState(Person personFileState, Person referencePerson) {
    prepareFileStateToAddToDb(personFileState, referencePerson);
    Person savedPersonFileState = personRepository.save(personFileState);

    logger.logAddFileState(savedPersonFileState);

    return savedPersonFileState;
  }

  public List<UUID> addPersonFileStates(List<Person> personsToAdd) {
    return mutexService.doWithLockedMutex(
        MUTEX_PERSON_WRITE, () -> addPersonFileStatesWhenLocked(personsToAdd));
  }

  private List<UUID> addPersonFileStatesWhenLocked(List<Person> fileStates) {
    List<Person> potentialMatches = findReferencePersonsByKeyAttributes(fileStates);

    Map<PersonKeyAttributes, Person> lowestIdPersons = createLowestIdMap(potentialMatches);

    for (Person fileState : fileStates) {
      PersonKeyAttributes key = personKeyAttributesOf(fileState);
      Person referencePerson =
          lowestIdPersons.computeIfAbsent(key, k -> addPersonForFileState(fileState));
      prepareFileStateToAddToDb(fileState, referencePerson);
      logger.logAddFileState(fileState);
    }

    personRepository.saveAll(fileStates);

    return fileStates.stream().map(Person::getExternalId).toList();
  }

  private static void prepareFileStateToAddToDb(Person fileState, Person referencePerson) {
    fileState.setReferencePerson(referencePerson);
    fileState.setReferenceVersion(referencePerson.getVersion());
    referencePerson.setDeleteAt(null);
  }

  static PersonKeyAttributes personKeyAttributesOf(Person fileState) {
    return new PersonKeyAttributes(
        fileState.getFirstName(),
        fileState.getLastName(),
        fileState.getBirthDetails().dateOfBirth());
  }

  private static Map<PersonKeyAttributes, Person> createLowestIdMap(List<Person> potentialMatches) {
    return potentialMatches.stream()
        .collect(
            Collectors.groupingBy(
                PersonService::personKeyAttributesOf,
                LinkedHashMap::new,
                Collectors.collectingAndThen(Collectors.toList(), List::getFirst)));
  }

  private static Set<PersonKeyAttributes> collectPersonKeyAttributes(
      Collection<Person> fileStates) {
    return fileStates.stream()
        .map(PersonService::personKeyAttributesOf)
        .collect(StreamUtil.toLinkedHashSet());
  }

  public List<Person> fuzzySearch(String firstName, String lastName, LocalDate dateOfBirth) {
    configureSimilarityThreshold(firstName, lastName);
    return fuzzySearch(firstName, lastName, dateOfBirth, false);
  }

  public List<Person> fuzzySearchIncludingDeleted(
      String firstName, String lastName, LocalDate dateOfBirth) {
    configureSimilarityThreshold(firstName, lastName);
    return fuzzySearch(firstName, lastName, dateOfBirth, true);
  }

  private List<Person> fuzzySearch(
      String firstName, String lastName, LocalDate dateOfBirth, boolean includeDeleted) {
    configureSimilarityThreshold(firstName, lastName);
    return personRepository.fuzzySearchReferencePersons(
        firstName,
        lastName,
        dateOfBirth,
        getSimilarityThreshold(firstName),
        getSimilarityThreshold(lastName),
        includeDeleted);
  }

  private void configureSimilarityThreshold(String firstName, String lastName) {
    double threshold =
        Math.min(getSimilarityThreshold(firstName), getSimilarityThreshold(lastName));
    fuzzySearchHelper.setSimilarityThreshold(threshold);
  }

  public Optional<Person> findMatchingReferencePerson(Person person) {
    Stream<Person> possibleMatches =
        personRepository.findReferencePersonByKeyAttributes(
            person.getFirstName(), person.getLastName(), person.getBirthDetails().dateOfBirth());
    return possibleMatches
        .filter(p -> isPersonMatch(person, p))
        .collect(StreamUtil.toSingleOptionalElement());
  }

  private Person addPersonForFileState(Person personFileState) {
    Person person = personFileState.cloneFromFileState();
    Person savedPerson = personRepository.save(person);

    logger.logAddReferenceData(savedPerson);
    return savedPerson;
  }

  public Instant getFileStateDeletionTimestamp(UUID id) {
    Person person = personRepository.findFileStateByExternalId(id).orElseThrow();
    return person.getDeleteAt();
  }

  public Instant getReferenceDeletionTimestampForFileState(UUID fileStateId) {
    Person person = personRepository.findReferencePersonByFileStateId(fileStateId).orElseThrow();
    return person.getDeleteAt();
  }

  public void markAllForDeletionAt(Set<UUID> fileStateIds, Instant timestamp) {
    mutexService.doWithLockedMutex(
        MUTEX_PERSON_WRITE, () -> markAllForDeletionAtWhenLocked(fileStateIds, timestamp));
  }

  private void markAllForDeletionAtWhenLocked(Set<UUID> fileStateIds, Instant timestamp) {
    List<Person> fileStates = findAllFilesStates(fileStateIds);

    Set<Person> referencePersons = new LinkedHashSet<>();
    for (Person fileState : fileStates) {
      Person referencePerson = fileState.getReferencePerson();
      referencePersons.add(referencePerson);
      fileState.setDeleteAt(timestamp);

      logger.logDeleteFileState(fileState);
    }

    for (Person referencePerson : referencePersons) {
      if (referencePerson.isActive()
          && personRepository.isReferencePersonObsolete(referencePerson.getExternalId())) {
        referencePerson.setDeleteAt(timestamp);

        logger.logDeleteReferenceData(referencePerson);
      }
    }
  }

  public Person updateFileStateAndReferencePerson(Person personFileState, Person fileStateUpdate) {
    return mutexService.doWithLockedMutex(
        MUTEX_PERSON_WRITE,
        () -> updateFileStateAndReferencePersonWhenLocked(personFileState, fileStateUpdate));
  }

  private Person updateFileStateAndReferencePersonWhenLocked(
      Person personFileState, Person fileStateUpdate) {
    if (personFileState.getDataOrigin() != DataOrigin.EXTERNAL
        && isPersonMatch(fileStateUpdate, personFileState)) {
      log.debug(
          "Recognized no-op update. Returning original person file state (id={})",
          personFileState.getId());
      return personFileState;
    }

    Person referencePerson =
        personRepository
            .findReferencePersonByFileStateId(personFileState.getExternalId())
            .orElseThrow(() -> new NotFoundException("Associated Reference Person not found"));

    if (isPersonFileStateOutdated(personFileState, referencePerson)) {
      throw new BadRequestException(ErrorCode.CONFLICT, "Person file state is outdated");
    }

    if (findMatchingReferencePerson(fileStateUpdate).isPresent()) {
      throw new AlreadyExistsException("Matching reference Person already exists");
    }

    applyPersonUpdate(fileStateUpdate, referencePerson);
    personRepository.flush();

    logger.logEditReferenceData(referencePerson);

    fileStateUpdate.setDataOrigin(DataOrigin.EDIT);
    return addPersonFileState(fileStateUpdate, referencePerson);
  }

  public Person syncFileState(Person personFileState, Long version) {
    return mutexService.doWithLockedMutex(
        MUTEX_PERSON_WRITE, () -> syncPersonWhenLocked(personFileState, version));
  }

  private Person syncPersonWhenLocked(Person personFileState, Long version) {
    Person referencePerson =
        personRepository
            .findReferencePersonByFileStateId(personFileState.getExternalId())
            .orElseThrow(() -> new NotFoundException("Associated Reference Person not found"));

    ValidationUtil.validateVersion(version, referencePerson);

    if (!isPersonFileStateOutdated(personFileState, referencePerson)) {
      throw new BadRequestException(
          ErrorCode.CONFLICT, "File state and associated reference person already match");
    }

    Person updatedFileState = referencePerson.cloneFromReferencePerson();
    updatedFileState.setDataOrigin(DataOrigin.EDIT);
    return addPersonFileState(updatedFileState, referencePerson);
  }

  public UpdatePersonsResponse updateFileStatesAndReferencesInBulk(
      Map<UUID, Person> fileStateUpdatesById) {
    return mutexService.doWithLockedMutex(
        MUTEX_PERSON_WRITE,
        () -> updateFileStatesAndReferencesInBulkWhenLocked(fileStateUpdatesById));
  }

  private UpdatePersonsResponse updateFileStatesAndReferencesInBulkWhenLocked(
      Map<UUID, Person> fileStateUpdatesById) {
    List<UUID> failedPersonIds =
        PersonBulkUpdateHelper.collectUpdatesWithOverlappingData(fileStateUpdatesById);
    failedPersonIds.addAll(
        collectUpdatesWithSameDataAsExistingReferencePersons(fileStateUpdatesById));

    failedPersonIds.forEach(fileStateUpdatesById::remove);
    Set<UUID> fileStateForUpdateIds = fileStateUpdatesById.keySet();

    Map<UUID, Person> fileStatesForUpdate =
        personRepository
            .findAllByExternalIdInAndReferencePersonIsNotNull(fileStateForUpdateIds)
            .collect(StreamUtil.toLinkedHashMap(Person::getExternalId));

    failedPersonIds.addAll(
        PersonBulkUpdateHelper.collectMissingIds(
            fileStatesForUpdate.keySet(), fileStateForUpdateIds));

    failedPersonIds.addAll(
        PersonBulkUpdateHelper.collectUpdatesOnOutdatedFileStates(fileStatesForUpdate.values()));
    failedPersonIds.addAll(
        PersonBulkUpdateHelper.collectUpdatesOnSameReference(fileStatesForUpdate.values()));

    List<UpdatePersonInBulkResult> results = new ArrayList<>();

    failedPersonIds.forEach(fileStateForUpdateIds::remove);
    for (UUID fileStateForUpdateId : fileStateForUpdateIds) {
      Person fileStateForUpdate = fileStatesForUpdate.get(fileStateForUpdateId);
      Person newFileState = fileStateUpdatesById.get(fileStateForUpdateId);

      Person updatedReference =
          applyPersonUpdate(newFileState, fileStateForUpdate.getReferencePerson());
      logger.logEditReferenceData(updatedReference);

      newFileState.setDataOrigin(DataOrigin.EDIT);
      addPersonFileState(newFileState, updatedReference);
      logger.logAddFileState(newFileState);

      results.add(
          new UpdatePersonInBulkResult(
              fileStateForUpdate.getExternalId(), newFileState.getExternalId()));
    }

    return new UpdatePersonsResponse(results, failedPersonIds);
  }

  private List<UUID> collectUpdatesWithSameDataAsExistingReferencePersons(
      Map<UUID, Person> fileStateUpdatesById) {
    List<Person> referencePersonMatches =
        findReferencePersonsByKeyAttributes(fileStateUpdatesById.values());

    return PersonBulkUpdateHelper.collectUpdatesWithSameDataAsExistingReferencePersons(
        fileStateUpdatesById, referencePersonMatches);
  }

  private Person applyPersonUpdate(Person fileStateUpdate, Person referencePerson) {
    referencePerson.setTitle(fileStateUpdate.getTitle());
    referencePerson.setSalutation(fileStateUpdate.getSalutation());
    referencePerson.setGender(fileStateUpdate.getGender());
    referencePerson.setFirstName(fileStateUpdate.getFirstName());
    referencePerson.setLastName(fileStateUpdate.getLastName());
    referencePerson.setBirthDetails(fileStateUpdate.getBirthDetails());
    referencePerson.setEmailAddresses(fileStateUpdate.getEmailAddresses());
    referencePerson.setPhoneNumbers(fileStateUpdate.getPhoneNumbers());
    referencePerson.setContactAddress(
        referencePerson.cloneAddress(fileStateUpdate.getContactAddress()));
    referencePerson.setDifferentBillingAddress(
        referencePerson.cloneAddress(fileStateUpdate.getDifferentBillingAddress()));
    referencePerson.setModifiedAt(Instant.now(clock));
    referencePerson.setDataOrigin(DataOrigin.EDIT);
    return referencePerson;
  }

  public Person addPersonFromExternalSource(Person personFileState) {
    Person referencePerson = personFileState.cloneFromFileState();
    referencePerson.setDataOrigin(DataOrigin.EXTERNAL);
    referencePerson.setDeleteAt(null);
    Person savedReferencePerson = personRepository.save(referencePerson);

    personFileState.setReferencePerson(savedReferencePerson);
    personFileState.setReferenceVersion(savedReferencePerson.getVersion());
    personFileState.setDataOrigin(DataOrigin.EXTERNAL);
    Person savedPersonFileState = personRepository.save(personFileState);

    logger.logAddReferenceData(savedReferencePerson);
    logger.logAddFileState(savedPersonFileState);
    return savedPersonFileState;
  }

  private List<Person> findAllFilesStates(Set<UUID> fileStateIds) {
    return personRepository.findAllByExternalIdInAndReferencePersonIsNotNullOrderById(
        new ArrayList<>(fileStateIds));
  }

  private List<Person> findReferencePersonsByKeyAttributes(Collection<Person> fileStates) {
    Set<PersonKeyAttributes> personKeyAttributes = collectPersonKeyAttributes(fileStates);
    return findReferencePersonsByKeyAttributes(personKeyAttributes);
  }

  public List<Person> findReferencePersonsByKeyAttributes(Set<PersonKeyAttributes> keyAttributes) {
    Specification<Person> personSpecification =
        (root, query, criteriaBuilder) -> {
          root.fetch(Person_.emailAddresses, JoinType.LEFT);
          root.fetch(Person_.contactAddress, JoinType.LEFT);
          root.fetch(Person_.differentBillingAddress, JoinType.LEFT);

          List<Predicate> conjunctions = new ArrayList<>();

          for (PersonKeyAttributes key : keyAttributes) {
            conjunctions.add(
                criteriaBuilder.and(
                    criteriaBuilder.equal(root.get(Person_.firstName), key.firstName()),
                    criteriaBuilder.equal(root.get(Person_.lastName), key.lastName()),
                    criteriaBuilder.equal(
                        root.get(Person_.birthDetails).get(BirthDetails_.dateOfBirth),
                        key.dateOfBirth()),
                    criteriaBuilder.isNull(root.get(Person_.referencePerson)),
                    criteriaBuilder.notEqual(root.get(Person_.dataOrigin), DataOrigin.EXTERNAL)));
          }

          assert query != null;
          query.orderBy(criteriaBuilder.asc(root.get(Person_.id)));

          return criteriaBuilder.or(conjunctions.toArray(Predicate[]::new));
        };

    return personRepository.findAll(personSpecification);
  }

  public Person updateReferencePerson(
      UUID referenceDataId, long version, Person referencePersonUpdate) {
    return mutexService.doWithLockedMutex(
        MUTEX_PERSON_WRITE,
        () -> updateReferencePersonWhenLocked(referenceDataId, version, referencePersonUpdate));
  }

  private Person updateReferencePersonWhenLocked(
      UUID referenceDataId, long version, Person referencePersonUpdate) {

    Person referencePerson = getReferencePerson(referenceDataId);
    ValidationUtil.validateVersion(version, referencePerson);

    boolean requiresUpdate =
        referencePerson.getDataOrigin() == DataOrigin.EXTERNAL
            || !PersonDiffer.isPersonMatch(referencePerson, referencePersonUpdate);

    if (requiresUpdate) {
      if (findMatchingReferencePerson(referencePersonUpdate).isPresent()) {
        throw new AlreadyExistsException("Matching reference Person already exists");
      }

      applyPersonUpdate(referencePersonUpdate, referencePerson);

      personRepository.flush();

      logger.logEditReferenceData(referencePerson);
    } else {
      log.debug("Recognized no-op update. Returning a new file state");
    }

    Person fileState = referencePerson.cloneFromReferencePerson();
    return addPersonFileState(fileState, referencePerson);
  }

  public int deleteExpiredFileStatesAndReferences(Instant expirationTime) {
    return mutexService.doWithLockedMutex(
        MUTEX_PERSON_WRITE, () -> deleteExpiredFileStatesAndReferencesWhenLocked(expirationTime));
  }

  private int deleteExpiredFileStatesAndReferencesWhenLocked(Instant expirationTime) {
    return personRepository.deleteByDeleteAtBefore(expirationTime);
  }
}
