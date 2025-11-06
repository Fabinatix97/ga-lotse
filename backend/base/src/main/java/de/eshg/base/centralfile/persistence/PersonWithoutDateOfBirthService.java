/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import static de.eshg.base.util.PersonWithoutDateOfBirthDiffer.isPersonMatch;

import de.eshg.base.centralfile.CentralFileAuditLogger;
import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.entity.PersonWithoutDateOfBirth;
import de.eshg.base.centralfile.persistence.repository.PersonWithoutDateOfBirthRepository;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class PersonWithoutDateOfBirthService {
  private static final Logger log = LogManager.getLogger(PersonWithoutDateOfBirthService.class);

  private static final String PERSON_WITHOUT_DATE_OF_BIRTH_NOT_FOUND =
      "PersonWithoutDateOfBirth not found";

  private final PersonWithoutDateOfBirthRepository personWithoutDateOfBirthRepository;
  private final Clock clock;
  private final CentralFileAuditLogger logger;

  public PersonWithoutDateOfBirthService(
      PersonWithoutDateOfBirthRepository personWithoutDateOfBirthRepository,
      Clock clock,
      CentralFileAuditLogger logger) {
    this.personWithoutDateOfBirthRepository = personWithoutDateOfBirthRepository;
    this.clock = clock;
    this.logger = logger;
  }

  public PersonWithoutDateOfBirth addPersonWithoutDateOfBirth(PersonWithoutDateOfBirth person) {
    person.setCreatedAt(clock.instant());
    PersonWithoutDateOfBirth personWithoutDateOfBirth =
        personWithoutDateOfBirthRepository.save(person);

    logger.logAddPersonWithoutDateOfBirth(personWithoutDateOfBirth);

    return personWithoutDateOfBirth;
  }

  public PersonWithoutDateOfBirth getPersonWithoutDateOfBirth(UUID id) {
    Optional<PersonWithoutDateOfBirth> result =
        personWithoutDateOfBirthRepository.findByExternalId(id);
    return result.orElseThrow(() -> new NotFoundException(PERSON_WITHOUT_DATE_OF_BIRTH_NOT_FOUND));
  }

  public List<PersonWithoutDateOfBirth> getBulkPersonsWithoutDateOfBirth(List<UUID> ids) {
    return personWithoutDateOfBirthRepository.findAllByExternalIdIn(ids);
  }

  public void markForDeletion(List<UUID> ids, Duration delay) {
    Instant timestamp = Instant.now(clock).plus(delay);
    for (UUID id : ids) {
      PersonWithoutDateOfBirth personWithoutDateOfBirth =
          personWithoutDateOfBirthRepository
              .findByExternalId(id)
              .orElseThrow(() -> new NotFoundException(PERSON_WITHOUT_DATE_OF_BIRTH_NOT_FOUND));
      personWithoutDateOfBirth.setDeleteAt(timestamp);
      logger.logDeletePersonWithoutDateOfBirth(personWithoutDateOfBirth);
    }

    personWithoutDateOfBirthRepository.flush();
  }

  public PersonWithoutDateOfBirth updatePersonWithoutDateOfBirth(
      UUID id, PersonWithoutDateOfBirth updatedPerson) {
    PersonWithoutDateOfBirth person =
        personWithoutDateOfBirthRepository
            .findByExternalId(id)
            .orElseThrow(() -> new NotFoundException(PERSON_WITHOUT_DATE_OF_BIRTH_NOT_FOUND));

    if (isPersonMatch(person, updatedPerson)) {
      log.debug("Recognized no-op update for person without date of birth (id={})", person.getId());
      return person;
    }

    applyPersonUpdate(updatedPerson, person);
    personWithoutDateOfBirthRepository.flush();

    logger.logEditPersonWithoutDateOfBirth(person);

    return person;
  }

  public int deleteExpiredEntries(Instant expirationTime) {
    return personWithoutDateOfBirthRepository.deleteByDeleteAtBefore(expirationTime);
  }

  private void applyPersonUpdate(
      PersonWithoutDateOfBirth updatePerson, PersonWithoutDateOfBirth persistedPerson) {
    persistedPerson.setTitle(updatePerson.getTitle());
    persistedPerson.setSalutation(updatePerson.getSalutation());
    persistedPerson.setGender(updatePerson.getGender());
    persistedPerson.setFirstName(updatePerson.getFirstName());
    persistedPerson.setLastName(updatePerson.getLastName());
    persistedPerson.setEmailAddresses(updatePerson.getEmailAddresses());
    persistedPerson.setPhoneNumbers(updatePerson.getPhoneNumbers());
    persistedPerson.setContactAddress(Person.cloneAddress(updatePerson.getContactAddress()));
    persistedPerson.setModifiedAt(Instant.now(clock));
    persistedPerson.setDataOrigin(DataOrigin.EDIT);
  }
}
