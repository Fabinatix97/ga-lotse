/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.util.ExceptionUtil.notFoundException;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.CHILD_MODIFIED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.CHILD_SYNCED_WITH_CENTRAL_FILE;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.CUSTODIAN_ADDED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.CUSTODIAN_MODIFIED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.CUSTODIAN_REMOVED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.CUSTODIAN_SYNCED_WITH_CENTRAL_FILE;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.schoolentry.api.CreatePersonDto;
import de.eshg.schoolentry.api.SyncPersonRequest;
import de.eshg.schoolentry.api.UpdatePersonRequest;
import de.eshg.schoolentry.client.PersonClient;
import de.eshg.schoolentry.domain.model.Person;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.PersonRepository;
import de.eshg.schoolentry.mapper.PersonMapper;
import de.eshg.schoolentry.util.ProgressEntryUtil;
import de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType;
import de.eshg.validation.ValidationUtil;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class PersonService {

  private static final Logger log = LoggerFactory.getLogger(PersonService.class);

  private final PersonRepository personRepository;
  private final PersonClient personClient;
  private final ProgressEntryUtil progressEntryUtil;

  public PersonService(
      PersonRepository personRepository,
      PersonClient personClient,
      ProgressEntryUtil progressEntryUtil) {
    this.personRepository = personRepository;
    this.personClient = personClient;
    this.progressEntryUtil = progressEntryUtil;
  }

  public void updateChildData(
      SchoolEntryProcedure procedure, Person child, UpdatePersonRequest request) {
    UUID currentFileStateId = child.getCentralFileStateId();
    UUID updatedFileStateId = personClient.updateChild(currentFileStateId, request);

    if (!updatedFileStateId.equals(currentFileStateId)) {
      child.setCentralFileStateId(updatedFileStateId);
      progressEntryUtil.addProgressEntry(procedure, CHILD_MODIFIED);
      personRepository.flush();
    }
  }

  public SchoolEntryProcedure syncPersonData(
      SchoolEntryProcedure procedure, Person person, SyncPersonRequest request) {
    UUID updatedFileStateId =
        personClient.syncPerson(person.getCentralFileStateId(), request.referenceVersion());
    person.setCentralFileStateId(updatedFileStateId);

    SchoolEntrySystemProgressEntryType progressEntryType =
        switch (person.getPersonType()) {
          case PATIENT -> CHILD_SYNCED_WITH_CENTRAL_FILE;
          case PARENT -> CUSTODIAN_SYNCED_WITH_CENTRAL_FILE;
          default -> throw new IllegalStateException("Unknown person type");
        };
    progressEntryUtil.addProgressEntry(procedure, progressEntryType);

    personRepository.flush();
    return procedure;
  }

  public void addCustodianToProcedure(
      SchoolEntryProcedure procedure, CreatePersonDto custodianDto) {
    UUID centralFileId;
    if (custodianDto.referenceId() != null) {
      try {
        centralFileId =
            personClient
                .createCentralFileStateForReferenceId(
                    custodianDto.referenceId(), PersonMapper.mapToPersonDetailsDto(custodianDto))
                .id();
      } catch (HttpClientErrorException.NotFound e) {
        throw new NotFoundException("Custodian not found", e.getResponseBodyAsString());
      }
    } else {
      centralFileId = personClient.createPersonInCentralFile(custodianDto);
    }
    SchoolEntryService.buildCustodian(centralFileId, procedure);

    progressEntryUtil.addProgressEntry(procedure, CUSTODIAN_ADDED);
    personRepository.flush();
  }

  public void updateCustodian(UpdatePersonRequest request, UUID centralFileStateId, Person person) {
    UUID newCentralFileStateId =
        personClient.updatePersonInCentralFile(request, centralFileStateId);

    if (!newCentralFileStateId.equals(centralFileStateId)) {
      person.setCentralFileStateId(newCentralFileStateId);
      progressEntryUtil.addProgressEntry(person.getProcedure(), CUSTODIAN_MODIFIED);
      personRepository.flush();
    }
  }

  public void removeCustodian(UUID centralFileStateId, SchoolEntryProcedure procedure) {
    log.info("Marking central file state {} for deletion", centralFileStateId);
    personClient.markCentralFileStatesForDeletion(centralFileStateId);
    log.info("Marked central file state {} for deletion", centralFileStateId);

    Person person =
        procedure.getRelatedPersons().stream()
            .filter(p -> p.getCentralFileStateId().equals(centralFileStateId))
            .collect(StreamUtil.toSingleOptionalElement())
            .orElseThrow(notFoundException(Person.class, centralFileStateId));
    procedure.getRelatedPersons().remove(person);

    progressEntryUtil.addProgressEntry(procedure, CUSTODIAN_REMOVED);
    personRepository.flush();
  }

  Person findChildForUpdate(UUID procedureId, long version) {
    Person child =
        personRepository.findByProcedureExternalIdAndTypeForUpdate(
            procedureId, Person.PERSON_TYPE_USED_FOR_CHILDREN);
    ValidationUtil.validateVersion(version, child);
    return child;
  }

  Person findPersonForUpdate(UUID procedureId, UUID fileStateId, long version) {
    Person person =
        personRepository.findByProcedureExternalIdAndFileStateIdForUpdate(procedureId, fileStateId);
    if (person == null) {
      throw new NotFoundException(
          "Person with fileStateId %s for procedure %s not found"
              .formatted(fileStateId, procedureId));
    }
    ValidationUtil.validateVersion(version, person);
    return person;
  }
}
