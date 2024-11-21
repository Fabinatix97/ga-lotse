/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import static de.eshg.stiprotection.api.GetStiProtectionProceduresSortOrderDto.ASC;
import static de.eshg.stiprotection.pdf.identification.DocumentParameters.mapToDepartment;
import static de.eshg.stiprotection.pdf.identification.DocumentParameters.toAppointmentTimeRange;
import static de.eshg.stiprotection.pdf.identification.DocumentParameters.toConsultationAppointment;
import static de.eshg.stiprotection.pdf.identification.DocumentParameters.toDocumentDate;
import static de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType.PERSON_DETAILS_UPDATED;

import de.eshg.base.calendar.api.TimeRange;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.stiprotection.api.CreateProcedureRequest;
import de.eshg.stiprotection.api.GetStiProtectionProceduresPaginationOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortByDto;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOrderDto;
import de.eshg.stiprotection.api.UpdatePersonDetailsRequest;
import de.eshg.stiprotection.mapper.AppointmentMapper;
import de.eshg.stiprotection.mapper.ConcernMapper;
import de.eshg.stiprotection.mapper.GenderMapper;
import de.eshg.stiprotection.pdf.identification.AnonymousIdentificationDocument;
import de.eshg.stiprotection.pdf.identification.AnonymousIdentificationDocumentService;
import de.eshg.stiprotection.pdf.identification.ConsultationAppointment;
import de.eshg.stiprotection.pdf.identification.Department;
import de.eshg.stiprotection.pdf.identification.DocumentSender;
import de.eshg.stiprotection.persistence.anonymoususer.AnonymousUserClient;
import de.eshg.stiprotection.persistence.data.ResultPage;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.Person;
import de.eshg.stiprotection.persistence.db.Person_;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure_;
import de.eshg.stiprotection.persistence.db.StiProtectionTask;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import jakarta.validation.Valid;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class StiProtectionProcedureService {

  private final AppointmentService appointmentService;
  private final StiProtectionProcedureRepository repository;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final AnonymousIdentificationDocumentService documentService;
  private final DepartmentClient departmentClient;
  private final AnonymousUserClient anonymousUserClient;

  public StiProtectionProcedureService(
      AppointmentService appointmentService,
      StiProtectionProcedureRepository procedures,
      Clock clock,
      AuditLogger auditLogger,
      AnonymousIdentificationDocumentService documentService,
      DepartmentClient departmentClient,
      AnonymousUserClient anonymousUserClient) {
    this.appointmentService = appointmentService;
    this.repository = procedures;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.documentService = documentService;
    this.departmentClient = departmentClient;
    this.anonymousUserClient = anonymousUserClient;
  }

  public StiProtectionProcedure createProcedure(CreateProcedureRequest request) {
    StiProtectionProcedure procedure = new StiProtectionProcedure();
    procedure.setProcedureType(ProcedureType.STI_PROTECTION);
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    procedure.setConcern(ConcernMapper.toDatabaseType(request.concern()));
    procedure.addRelatedPerson(createPerson(request));
    procedure.addTask(createTask());
    procedure.setWaitingRoom(new WaitingRoom());

    appointmentService.createAppointment(procedure, AppointmentMapper.toDataType(request));

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
    UUID anonymousUserId = procedure.getPerson().getAnonymousUserId();
    return new StiProtectionProcedureData(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        procedure.getProcedureStatus(),
        procedure.getConcern(),
        procedure.getPerson(),
        procedure.getAppointment(),
        procedure.getUserDefinedAppointment(),
        procedure.getAppointmentHistory(),
        procedure.getWaitingRoom(),
        anonymousUserClient.getAccessCode(anonymousUserId));
  }

  public StiProtectionProcedureData getProcedure(UUID procedureId) {
    return toProcedureData(findProcedureByExternalId(procedureId));
  }

  protected StiProtectionProcedure findProcedureByExternalId(UUID procedureId) {
    return repository
        .findByExternalId(procedureId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "%s with UUID %s not found"
                        .formatted(StiProtectionProcedure.class.getSimpleName(), procedureId)));
  }

  public void updatePersonDetails(UUID procedureId, @Valid UpdatePersonDetailsRequest request) {
    StiProtectionProcedure procedure = findProcedureByExternalId(procedureId);
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (procedureStatus.isOpen()) {
      Person person = procedure.getPerson();
      person.setGender(GenderMapper.toDatabaseType(request.gender()));
      person.setYearOfBirth(request.yearOfBirth());
      person.setCountryOfBirth(request.countryOfBirth());
      person.setInGermanySince(request.inGermanySince());

      SystemProgressEntry progressEntry =
          SystemProgressEntryFactory.createSystemProgressEntry(
              PERSON_DETAILS_UPDATED.name(),
              "Die Angaben zur Person wurden aktualisiert",
              TriggerType.SYSTEM_AUTOMATIC);
      procedure.addProgressEntry(progressEntry);
    } else {
      throw unexpectedProcedureStatus(procedureId, procedureStatus);
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

  protected static BadRequestException unexpectedProcedureStatus(
      UUID procedureId, ProcedureStatus procedureStatus) {
    return new BadRequestException(
        "%s: unexpected procedure status: %s".formatted(procedureId, procedureStatus));
  }

  public Pdf getAnonymousIdentificationDocument(UUID procedureId) {
    StiProtectionProcedureData procedure = getProcedure(procedureId);
    TimeRange timeRange = toAppointmentTimeRange(procedure);
    Department department = mapToDepartment(departmentClient.getDepartmentInfo());
    String documentDate = toDocumentDate(clock.instant());
    DepartmentLogo departmentLogo = departmentClient.getDepartmentLogo();
    String accessCode = getAccessCode(procedure);
    ConsultationAppointment appointment =
        toConsultationAppointment(department, timeRange, accessCode);
    DocumentSender sender = new DocumentSender(department, documentDate, departmentLogo);
    return documentService.createPdf(new AnonymousIdentificationDocument(sender, appointment));
  }

  private String getAccessCode(StiProtectionProcedureData procedure) {
    UUID anonymousUserId = procedure.person().getAnonymousUserId();
    if (anonymousUserId == null) {
      throw new BadRequestException("Anonymous user not registered");
    }
    String accessCode = anonymousUserClient.getAccessCode(anonymousUserId);
    if (!StringUtils.hasText(accessCode)) {
      throw new BadRequestException("Access code cannot be null or blank");
    }
    return accessCode;
  }
}
