/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static java.util.Comparator.comparing;
import static java.util.Comparator.comparingLong;
import static java.util.Comparator.nullsLast;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonsSortKey;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.lib.procedure.procedures.ProcedureSearchService;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.ProcedureFilterParameters;
import de.eshg.schoolentry.api.ProcedurePaginationAndSortParameters;
import de.eshg.schoolentry.api.ProcedureSearchParameters;
import de.eshg.schoolentry.api.SchoolDto;
import de.eshg.schoolentry.api.SchoolEntryProcedureSortKey;
import de.eshg.schoolentry.api.WaitingRoomProcedurePaginationAndSortParameters;
import de.eshg.schoolentry.business.model.PagedProcedures;
import de.eshg.schoolentry.business.model.PagedWaitingRoomProcedures;
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
import de.eshg.schoolentry.mapper.WaitingRoomMapper;
import de.eshg.schoolentry.util.ProcedurePageSpec;
import de.eshg.schoolentry.util.ProcedureSortKey;
import de.eshg.schoolentry.util.WaitingRoomPageSpec;
import de.eshg.schoolentry.util.WaitingRoomSortKey;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class ProcedureOverviewService {

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final ProcedureSearchService<SchoolEntryProcedure> procedureSearchService;
  private final PersonClient personClient;
  private final ContactClient contactClient;
  private final EntityManager entityManager;
  private final Validator validator;
  private final Clock clock;

  public ProcedureOverviewService(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      ProcedureSearchService<SchoolEntryProcedure> procedureSearchService,
      PersonClient personClient,
      ContactClient contactClient,
      EntityManager entityManager,
      Validator validator,
      Clock clock) {
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.procedureSearchService = procedureSearchService;
    this.personClient = personClient;
    this.contactClient = contactClient;
    this.entityManager = entityManager;
    this.validator = validator;
    this.clock = clock;
  }

  public PagedWaitingRoomProcedures getWaitingRoomProcedures(
      WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {

    WaitingRoomPageSpec pageSpec =
        WaitingRoomMapper.mapToPageSpec(
            paginationAndSortParameters.pageNumberOrFallback(0),
            paginationAndSortParameters.pageSizeOrFallback(25),
            paginationAndSortParameters.sortKeyOrFallback(
                de.eshg.schoolentry.api.WaitingRoomSortKey.ID),
            paginationAndSortParameters.sortDirectionOrFallback(SortDirection.DESC));

    return getWaitingRoomProcedures(pageSpec);
  }

  private PagedWaitingRoomProcedures getWaitingRoomProcedures(WaitingRoomPageSpec pageSpec) {
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
            .map(GetPersonFileStateResponse::id)
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

  public PagedProcedures getProcedures(
      ProcedureFilterParameters filterParameters,
      ProcedurePaginationAndSortParameters paginationAndSortParameters,
      ProcedureSearchParameters searchParameters) {

    ProcedurePageSpec pageSpec = createPageSpec(paginationAndSortParameters);

    if (filterParameters.schoolYearFilter() != null) {
      validator.validateSchoolYear(Year.of(filterParameters.schoolYearFilter()));
    }

    if (Validator.hasNonNullValue(searchParameters)) {
      List<SchoolEntryProcedure> allProcedures =
          procedureSearchService.searchProceduresByPerson(
              searchParameters.searchFirstName(),
              searchParameters.searchLastName(),
              searchParameters.searchDateOfBirth(),
              PersonType.PATIENT);

      int offset = pageSpec.pageNumber() * pageSpec.pageSize();

      List<ProcedureData> sortedAndFilteredProcedures =
          augmentWithChildData(allProcedures)
              .sorted(procedureSortComparator(pageSpec.sortKey(), pageSpec.direction()))
              .skip(offset)
              .limit(pageSpec.pageSize())
              .toList();

      return new PagedProcedures(sortedAndFilteredProcedures, allProcedures.size());
    } else {
      return getOpenSchoolEntryProcedures(filterParameters, pageSpec);
    }
  }

  private PagedProcedures getOpenSchoolEntryProcedures(
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
            filterParameters.isInvitationSentFilter(),
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
            .map(GetPersonFileStateResponse::id)
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

  private List<UUID> findAllChildIds(Specification<SchoolEntryProcedure> procedureSpecification) {
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UUID> query = criteriaBuilder.createQuery(UUID.class);
    Root<SchoolEntryProcedure> root = query.from(SchoolEntryProcedure.class);

    Join<?, ?> relatedPersonsJoin = root.join(SchoolEntryProcedure_.RELATED_PERSONS);
    Join<?, ?> childJoin =
        relatedPersonsJoin.on(
            criteriaBuilder.equal(
                relatedPersonsJoin.get(RelatedPerson_.PERSON_TYPE), PersonType.PATIENT));
    query.select(childJoin.get(RelatedPerson_.CENTRAL_FILE_STATE_ID));

    query.where(procedureSpecification.toPredicate(root, query, criteriaBuilder));

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
        schools.stream()
            .filter(school -> school.id().equals(procedureSchoolId))
            .collect(StreamUtil.toSingleOptionalElement());

    if (procedureSchoolId != null && optionalSchool.isEmpty()) {
      throw new BadRequestException(
          "Could not find school with id %s in central file".formatted(procedureSchoolId));
    }

    return optionalSchool.orElse(null);
  }

  private static ProcedurePageSpec createPageSpec(
      ProcedurePaginationAndSortParameters paginationAndSortParameters) {
    return ProcedureMapper.mapToPageSpec(
        paginationAndSortParameters.pageNumberOrFallback(0),
        paginationAndSortParameters.pageSizeOrFallback(25),
        paginationAndSortParameters.sortKeyOrFallback(SchoolEntryProcedureSortKey.ID),
        paginationAndSortParameters.sortDirectionOrFallback(SortDirection.DESC));
  }

  private static Comparator<ProcedureData> procedureSortComparator(
      ProcedureSortKey sortKey, Sort.Direction sortDirection) {
    return switch (sortKey) {
      case ID -> comparingLong(ProcedureData::internalId);
      case DATE_OF_BIRTH ->
          comparing(ProcedureData::getDateOfBirthOfChild, nullsComparator(sortDirection));
      case FIRSTNAME ->
          comparing(
              procedureData -> procedureData.child().firstName().toUpperCase(),
              nullsComparator(sortDirection));
      case LASTNAME ->
          comparing(
              procedureData -> procedureData.child().lastName().toUpperCase(),
              nullsComparator(sortDirection));
      case PROCEDURE_TYPE ->
          comparing(
              procedureData -> procedureData.type().toString(), nullsComparator(sortDirection));
      case SCHOOL_YEAR -> comparing(ProcedureData::schoolYear, nullsComparator(sortDirection));
      case APPOINTMENT_START ->
          comparing(ProcedureData::appointmentStart, nullsComparator(sortDirection));
      case CREATED_AT -> comparing(ProcedureData::createdAt, nullsComparator(sortDirection));
      case MODIFIED_AT -> comparing(ProcedureData::modifiedAt, nullsComparator(sortDirection));
    };
  }

  private static <T extends Comparable<T>> Comparator<T> nullsComparator(
      Sort.Direction sortDirection) {
    Comparator<T> innerComparator = Comparator.naturalOrder();
    if (sortDirection.equals(Sort.Direction.DESC)) {
      innerComparator = innerComparator.reversed();
    }
    return nullsLast(innerComparator);
  }
}
