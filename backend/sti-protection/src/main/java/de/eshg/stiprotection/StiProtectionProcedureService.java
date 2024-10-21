/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import static de.eshg.stiprotection.api.GetStiProtectionProceduresSortOrderDto.ASC;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.stiprotection.api.AppointmentBookingTypeDto;
import de.eshg.stiprotection.api.CreateProcedureRequest;
import de.eshg.stiprotection.api.GetStiProtectionProceduresPaginationOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortByDto;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOrderDto;
import de.eshg.stiprotection.mapper.ConcernMapper;
import de.eshg.stiprotection.mapper.GenderMapper;
import de.eshg.stiprotection.persistence.data.ResultPage;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.Person;
import de.eshg.stiprotection.persistence.db.Person_;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure_;
import de.eshg.stiprotection.persistence.db.StiProtectionTask;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class StiProtectionProcedureService {

  private final AppointmentService appointmentService;
  private final StiProtectionProcedureRepository repository;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public StiProtectionProcedureService(
      AppointmentService appointmentService,
      StiProtectionProcedureRepository procedures,
      Clock clock,
      AuditLogger auditLogger) {
    this.appointmentService = appointmentService;
    this.repository = procedures;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public StiProtectionProcedure createProcedure(CreateProcedureRequest request) {
    StiProtectionProcedure procedure = new StiProtectionProcedure();
    procedure.setProcedureType(ProcedureType.STI_PROTECTION);
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    procedure.setConcern(ConcernMapper.toDatabaseType(request.concern()));
    procedure.addRelatedPerson(createPerson(request));
    procedure.addTask(createTask());
    bookAppointment(procedure, request);
    return repository.save(procedure);
  }

  private Person createPerson(CreateProcedureRequest request) {
    Person person = new Person();
    person.setCentralFileStateId(createUniqueDummyCentralFileStateId());
    person.setPersonType(PersonType.PATIENT);
    person.setGender(GenderMapper.toDatabaseType(request.gender()));
    person.setYearOfBirth(request.yearOfBirth());
    person.setCountryOfBirth(request.countryOfBirth());
    person.setInGermanySince(request.inGermanySince());
    return person;
  }

  /**
   * @deprecated The STI module does not use the central file API for storing person related
   *     information. All person information is supposed to be anonymous and will be kept directly
   *     inside the module db. Currently, every {@link RelatedPerson RelatedPerson} is
   *     <b>required</b> to have a <u>unique</u> <b>CentralFileStateId</b>. In order to fulfill this
   *     requirement we insert a random UUID as a dummy ID. <br>
   *     <br>
   *     This usage should be refactored as soon as the procedure library is flexible enough to
   *     reflect our use case.
   */
  @Deprecated(since = "forever")
  private UUID createUniqueDummyCentralFileStateId() {
    return UUID.randomUUID();
  }

  private StiProtectionTask createTask() {
    StiProtectionTask task = new StiProtectionTask();
    task.setTaskType(TaskType.STI_PROTECTION);
    task.setTaskStatus(TaskStatus.OPEN);
    task.assign(
        CurrentUserHelper.getCurrentUserId(),
        CurrentUserHelper.getCurrentUserId(),
        Instant.now(clock));
    return task;
  }

  public ResultPage<StiProtectionProcedureData> getProcedures(
      GetStiProtectionProceduresSortOptions sortOptions,
      GetStiProtectionProceduresPaginationOptions paginationOptions) {

    PageRequest pageRequest =
        PageRequest.of(paginationOptions.pageNumber(), paginationOptions.pageSize());

    Page<StiProtectionProcedure> procedures =
        repository.findAll(
            Specification.where(joinPersonAndSort(sortOptions.sortOrder(), sortOptions.sortBy())),
            pageRequest);

    if (procedures.isEmpty()) {
      return new ResultPage<>(0, 0, List.of());
    }

    return new ResultPage<>(
        procedures.getTotalPages(),
        procedures.getTotalElements(),
        procedures.stream().map(this::toProcedureData).toList());
  }

  private Specification<StiProtectionProcedure> joinPersonAndSort(
      GetStiProtectionProceduresSortOrderDto sortOrder,
      GetStiProtectionProceduresSortByDto sortBy) {
    return (root, query, criteriaBuilder) -> {
      Join<StiProtectionProcedure, Person> psJoin =
          root.join(Procedure_.RELATED_PERSONS, JoinType.INNER);

      Path<?> sortProperty = getSortProperty(sortBy, root, psJoin);

      assert query != null;
      if (sortOrder == ASC) {
        query.orderBy(criteriaBuilder.asc(sortProperty));
      } else {
        query.orderBy(criteriaBuilder.desc(sortProperty));
      }
      return criteriaBuilder.conjunction();
    };
  }

  private static Path<?> getSortProperty(
      GetStiProtectionProceduresSortByDto sortBy,
      Root<StiProtectionProcedure> root,
      Join<StiProtectionProcedure, Person> psJoin) {
    return switch (sortBy) {
      case CREATED_AT -> root.get(Procedure_.createdAt);
      case STATUS -> root.get(Procedure_.procedureStatus);
      case CONCERN -> root.get(StiProtectionProcedure_.concern);
      case YEAR_OF_BIRTH -> psJoin.get(Person_.yearOfBirth);
      case GENDER -> psJoin.get(Person_.gender);
    };
  }

  private StiProtectionProcedureData toProcedureData(StiProtectionProcedure procedure) {
    return new StiProtectionProcedureData(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        procedure.getProcedureStatus(),
        procedure.getConcern(),
        procedure.getPerson(),
        procedure.getAppointment(),
        procedure.getUserDefinedAppointment());
  }

  public StiProtectionProcedureData getProcedure(UUID procedureId) {
    return toProcedureData(findProcedureByExternalId(procedureId));
  }

  private StiProtectionProcedure findProcedureByExternalId(UUID procedureId) {
    return repository
        .findByExternalId(procedureId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "%s with UUID %s not found"
                        .formatted(StiProtectionProcedure.class.getSimpleName(), procedureId)));
  }

  public MedicalHistory createMedicalHistory(UUID procedureId, MedicalHistory medicalHistory) {
    StiProtectionProcedure procedure = findProcedureByExternalId(procedureId);
    procedure.setMedicalHistory(medicalHistory);
    return medicalHistory;
  }

  public MedicalHistory getMedicalHistory(UUID procedureId) {
    MedicalHistory medicalHistory = findProcedureByExternalId(procedureId).getMedicalHistory();
    if (medicalHistory == null) {
      throw new NotFoundException(procedureId + ": no medical history found");
    }
    return medicalHistory;
  }

  private void bookAppointment(StiProtectionProcedure procedure, CreateProcedureRequest request) {
    if (request.appointmentBookingType() == AppointmentBookingTypeDto.APPOINTMENT_BLOCK) {
      appointmentService.bookAppointment(
          procedure, request.appointmentStart(), request.durationInMinutes());

    } else if (request.appointmentBookingType() == AppointmentBookingTypeDto.USER_DEFINED) {
      appointmentService.bookUserDefinedAppointment(
          procedure, request.appointmentStart(), request.durationInMinutes());
    }
  }

  public void closeProcedure(UUID procedureId) {
    StiProtectionProcedure procedure = findProcedureByExternalId(procedureId);
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (procedureStatus.isOpen()) {
      procedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    } else {
      throw unexpectedProcedureStatus(procedureId, procedureStatus);
    }
  }

  public void reopenProcedure(UUID procedureId) {
    StiProtectionProcedure procedure = findProcedureByExternalId(procedureId);
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (!procedureStatus.isOpen()) {
      procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    } else {
      throw unexpectedProcedureStatus(procedureId, procedureStatus);
    }
  }

  private static BadRequestException unexpectedProcedureStatus(
      UUID procedureId, ProcedureStatus procedureStatus) {
    return new BadRequestException(
        "%s: unexpected procedure status: %s".formatted(procedureId, procedureStatus));
  }
}
