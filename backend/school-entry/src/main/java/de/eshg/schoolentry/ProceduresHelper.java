/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonsSortKey;
import de.eshg.base.client.ContactClient;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.ProcedureFilterParameters;
import de.eshg.schoolentry.api.SchoolDto;
import de.eshg.schoolentry.business.model.ProcedureData;
import de.eshg.schoolentry.business.model.ProcedureWithChildData;
import de.eshg.schoolentry.business.model.WaitingRoomProcedureData;
import de.eshg.schoolentry.client.PersonClient;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.schoolentry.domain.specification.SchoolEntryProcedureSpecification;
import de.eshg.schoolentry.domain.specification.WaitingRoomSpecification;
import de.eshg.schoolentry.mapper.ProcedureMapper;
import de.eshg.schoolentry.util.ProcedureSortKey;
import de.eshg.schoolentry.util.WaitingRoomSortKey;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
class ProceduresHelper {

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final PersonClient personClient;
  private final ContactClient contactClient;
  private final EntityManager entityManager;
  private final Clock clock;

  public ProceduresHelper(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      PersonClient personClient,
      ContactClient contactClient,
      EntityManager entityManager,
      Clock clock) {
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.personClient = personClient;
    this.contactClient = contactClient;
    this.entityManager = entityManager;
    this.clock = clock;
  }

  PagedWaitingRoomProcedures getWaitingRoomProcedures(WaitingRoomPageSpec pageSpec) {
    WaitingRoomSpecification waitingRoomSpecification =
        new WaitingRoomSpecification(pageSpec.sortKey(), pageSpec.direction());

    if (!pageSpec.sortKey().isPersonAttribute()) {
      Page<SchoolEntryProcedure> schoolEntryProcedures =
          schoolEntryProcedureRepository.findAll(
              waitingRoomSpecification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
      List<WaitingRoomProcedureData> procedureData =
          augmentWithWaitingRoomData(schoolEntryProcedures.getContent()).toList();
      return new PagedWaitingRoomProcedures(
          procedureData, schoolEntryProcedures.getTotalElements());
    }

    List<UUID> personIds = findAllChildIds(waitingRoomSpecification);

    List<UUID> pagedAndSortedChildIds =
        personClient
            .fetchPersonsBulk(
                personIds,
                mapToGetPersonsSortKey(pageSpec.sortKey()),
                pageSpec.direction(),
                pageSpec.pageNumber(),
                pageSpec.pageSize())
            .stream()
            .map(AddPersonFileStateResponse::id)
            .toList();

    List<SchoolEntryProcedure> result =
        schoolEntryProcedureRepository
            .findByRelatedPersons(pagedAndSortedChildIds)
            .sorted(
                Comparator.comparingInt(
                    procedure -> {
                      int index =
                          pagedAndSortedChildIds.indexOf(procedure.getChildIdFromCentralFile());
                      Assert.isTrue(index >= 0, "Unexpected index: " + index);
                      return index;
                    }))
            .toList();

    List<WaitingRoomProcedureData> procedureData = augmentWithWaitingRoomData(result).toList();
    return new PagedWaitingRoomProcedures(procedureData, personIds.size());
  }

  PagedProcedures getOpenSchoolEntryProcedures(
      ProcedureFilterParameters filterParameters, ProcedurePageSpec pageSpec) {
    SchoolEntryProcedureSpecification schoolEntryProcedureSpecification =
        new SchoolEntryProcedureSpecification(
            ProcedureStatus.OPEN,
            ProcedureMapper.mapToDomain(filterParameters.procedureTypeFilter()),
            filterParameters.schoolIdFilter(),
            ProcedureMapper.mapIntegerToYear(filterParameters.schoolYearFilter()),
            getDayOfAppointmentAsInstant(filterParameters.dayOfAppointmentFilter()),
            filterParameters.hasAppointmentFilter(),
            new ArrayList<>(
                filterParameters.labelsFilter() == null
                    ? Collections.emptyList()
                    : filterParameters.labelsFilter()),
            pageSpec.sortKey(),
            pageSpec.direction());

    if (!pageSpec.sortKey().isPersonAttribute()) {
      Page<SchoolEntryProcedure> schoolEntryProcedures =
          schoolEntryProcedureRepository.findAll(
              schoolEntryProcedureSpecification,
              PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
      List<ProcedureData> procedureData =
          augmentWithChildData(schoolEntryProcedures.getContent()).toList();
      return new PagedProcedures(procedureData, schoolEntryProcedures.getTotalElements());
    }

    List<UUID> personIds = findAllChildIds(schoolEntryProcedureSpecification);

    List<UUID> pagedAndSortedChildIds =
        personClient
            .fetchPersonsBulk(
                personIds,
                mapToGetPersonsSortKey(pageSpec.sortKey()),
                pageSpec.direction(),
                pageSpec.pageNumber(),
                pageSpec.pageSize())
            .stream()
            .map(AddPersonFileStateResponse::id)
            .toList();

    List<SchoolEntryProcedure> result =
        schoolEntryProcedureRepository
            .findByRelatedPersons(pagedAndSortedChildIds)
            .sorted(
                Comparator.comparingInt(
                    procedure -> {
                      int index =
                          pagedAndSortedChildIds.indexOf(procedure.getChildIdFromCentralFile());
                      Assert.isTrue(index >= 0, "Unexpected index: " + index);
                      return index;
                    }))
            .toList();

    List<ProcedureData> procedureData = augmentWithChildData(result).toList();
    return new PagedProcedures(procedureData, personIds.size());
  }

  private static GetPersonsSortKey mapToGetPersonsSortKey(ProcedureSortKey sortKey) {
    return switch (sortKey) {
      case DATE_OF_BIRTH -> GetPersonsSortKey.DATE_OF_BIRTH;
      case FIRSTNAME -> GetPersonsSortKey.FIRST_NAME;
      case LASTNAME -> GetPersonsSortKey.LAST_NAME;
      case ID, SCHOOL_YEAR, PROCEDURE_TYPE, APPOINTMENT_START, CREATED_AT, MODIFIED_AT ->
          throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
    };
  }

  private static GetPersonsSortKey mapToGetPersonsSortKey(WaitingRoomSortKey sortKey) {
    return switch (sortKey) {
      case DATE_OF_BIRTH -> GetPersonsSortKey.DATE_OF_BIRTH;
      case FIRSTNAME -> GetPersonsSortKey.FIRST_NAME;
      case LASTNAME -> GetPersonsSortKey.LAST_NAME;
      case ID, INFO, STATUS, MODIFIED_AT ->
          throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
    };
  }

  private List<UUID> findAllChildIds(
      SchoolEntryProcedureSpecification schoolEntryProcedureSpecification) {
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UUID> query = criteriaBuilder.createQuery(UUID.class);
    Root<SchoolEntryProcedure> root = query.from(SchoolEntryProcedure.class);

    Join<?, ?> relatedPersonsJoin = root.join(SchoolEntryProcedure_.RELATED_PERSONS);
    Join<?, ?> childJoin =
        relatedPersonsJoin.on(
            criteriaBuilder.equal(
                relatedPersonsJoin.get(RelatedPerson_.PERSON_TYPE), PersonType.PATIENT));
    query.select(childJoin.get(RelatedPerson_.CENTRAL_FILE_STATE_ID));

    query.where(schoolEntryProcedureSpecification.toPredicate(root, query, criteriaBuilder));

    return entityManager.createQuery(query).getResultList();
  }

  private List<UUID> findAllChildIds(WaitingRoomSpecification waitingRoomSpecification) {
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UUID> query = criteriaBuilder.createQuery(UUID.class);
    Root<SchoolEntryProcedure> root = query.from(SchoolEntryProcedure.class);

    Join<?, ?> relatedPersonsJoin = root.join(SchoolEntryProcedure_.RELATED_PERSONS);
    Join<?, ?> childJoin =
        relatedPersonsJoin.on(
            criteriaBuilder.equal(
                relatedPersonsJoin.get(RelatedPerson_.PERSON_TYPE), PersonType.PATIENT));
    query.select(childJoin.get(RelatedPerson_.CENTRAL_FILE_STATE_ID));

    query.where(waitingRoomSpecification.toPredicate(root, query, criteriaBuilder));

    return entityManager.createQuery(query).getResultList();
  }

  private Instant getDayOfAppointmentAsInstant(LocalDate dayOfAppointmentFilter) {
    if (dayOfAppointmentFilter == null) {
      return null;
    }
    return dayOfAppointmentFilter.atStartOfDay(clock.getZone()).toInstant();
  }

  Stream<WaitingRoomProcedureData> augmentWithWaitingRoomData(
      List<SchoolEntryProcedure> procedures) {
    return personClient
        .augmentWithChildData(procedures)
        .map(
            data ->
                new WaitingRoomProcedureData(
                    data.procedure().getId(),
                    data.procedure().getExternalId(),
                    data.child(),
                    data.procedure().getWaitingRoom(),
                    data.procedure().getWaitingRoom().getModifiedAt()));
  }

  Stream<ProcedureData> augmentWithChildData(List<SchoolEntryProcedure> procedures) {
    List<SchoolDto> schools = getSchools(procedures);

    return personClient
        .augmentWithChildData(procedures)
        .map(
            data ->
                new ProcedureData(
                    data.procedure().getId(),
                    data.procedure().getExternalId(),
                    data.procedure().getProcedureType(),
                    data.child(),
                    data.procedure().getProcedureStatus(),
                    getSchool(data, schools),
                    data.procedure().getSchoolYear(),
                    data.procedure().getLabels(),
                    data.procedure().getAppointment() != null
                        ? data.procedure().getAppointment().getAppointmentStart()
                        : null,
                    data.procedure().getCreatedAt(),
                    data.procedure().getModifiedAt()));
  }

  private List<SchoolDto> getSchools(List<SchoolEntryProcedure> procedures) {
    List<UUID> schoolIds =
        procedures.stream()
            .map(SchoolEntryProcedure::getSchoolId)
            .filter(Objects::nonNull)
            .distinct()
            .toList();

    return contactClient.getBulkContacts(schoolIds).stream()
        .map(contact -> new SchoolDto(contact.id(), contact.name()))
        .toList();
  }

  private static SchoolDto getSchool(ProcedureWithChildData data, List<SchoolDto> schools) {
    UUID procedureSchoolId = data.procedure().getSchoolId();
    Optional<SchoolDto> optionalSchool =
        schools.stream().filter(school -> school.id().equals(procedureSchoolId)).findFirst();

    if (procedureSchoolId != null && optionalSchool.isEmpty()) {
      throw new BadRequestException(
          "Could not find school with id %s in central file".formatted(procedureSchoolId));
    }

    return optionalSchool.orElse(null);
  }
}
