/*
 * Copyright 2025 cronn GmbH
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
import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithPinCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.citizenuser.api.CredentialTypeDto;
import de.eshg.base.citizenuser.api.VerifyCitizenAccessCodeUserCredentialsRequest;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.stiprotection.api.GetStiProtectionProceduresPaginationOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortByDto;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOrderDto;
import de.eshg.stiprotection.mapper.PersonMapper;
import de.eshg.stiprotection.pdf.identification.AnonymousIdentificationDocument;
import de.eshg.stiprotection.pdf.identification.AnonymousIdentificationDocumentService;
import de.eshg.stiprotection.pdf.identification.ConsultationAppointment;
import de.eshg.stiprotection.pdf.identification.Department;
import de.eshg.stiprotection.pdf.identification.DocumentSender;
import de.eshg.stiprotection.persistence.data.PersonData;
import de.eshg.stiprotection.persistence.data.ResultPage;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.Person;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure_;
import de.eshg.stiprotection.persistence.db.StiProtectionTask;
import de.eshg.stiprotection.util.ProgressEntryUtil;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class StiProtectionProcedureService {

  private final StiProtectionProcedureRepository repository;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final AnonymousIdentificationDocumentService documentService;
  private final DepartmentClient departmentClient;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;
  private final StiProtectionProcedureFinder procedureFinder;
  private final ProgressEntryUtil progressEntryUtil;

  public StiProtectionProcedureService(
      StiProtectionProcedureRepository procedures,
      Clock clock,
      AuditLogger auditLogger,
      AnonymousIdentificationDocumentService documentService,
      DepartmentClient departmentClient,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi,
      StiProtectionProcedureFinder procedureFinder,
      ProgressEntryUtil progressEntryUtil) {
    this.repository = procedures;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.documentService = documentService;
    this.departmentClient = departmentClient;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
    this.procedureFinder = procedureFinder;
    this.progressEntryUtil = progressEntryUtil;
  }

  public StiProtectionProcedure createProcedure(Concern concern) {
    StiProtectionProcedure procedure =
        StiProtectionProcedure.newProcedure(concern, clock, auditLogger);
    procedure.addTask(createTask());
    return repository.save(procedure);
  }

  public StiProtectionProcedure saveProcedure(Concern concern) {
    return repository.save(StiProtectionProcedure.newProcedure(concern, clock, auditLogger));
  }

  public void addPerson(StiProtectionProcedure procedure, PersonData personData) {
    Person person = PersonMapper.toDatabaseType(personData);
    person.setCentralFileStateId(createUniqueDummyCentralFileStateId());
    person.setPersonType(PersonType.PATIENT);
    procedure.addRelatedPerson(person);
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
      Path<?> sortProperty = getSortProperty(sortBy, root);

      if (sortOrder == ASC) {
        query.orderBy(criteriaBuilder.asc(sortProperty));
      } else {
        query.orderBy(criteriaBuilder.desc(sortProperty));
      }
      return criteriaBuilder.conjunction();
    };
  }

  private static Path<?> getSortProperty(
      GetStiProtectionProceduresSortByDto sortBy, Root<StiProtectionProcedure> root) {
    return switch (sortBy) {
      case CREATED_AT -> root.get(Procedure_.createdAt);
      case SAMPLE_BARCODE -> root.get(StiProtectionProcedure_.sampleBarCode);
      case APPOINTMENT -> root.get(StiProtectionProcedure_.appointmentStart);
    };
  }

  private StiProtectionProcedureData toProcedureData(StiProtectionProcedure procedure) {
    UUID anonymousUserId = procedure.getAnonymousUserId();
    String accessCode =
        anonymousUserId != null
            ? citizenAccessCodeUserApi.getCitizenAccessCodeUser(anonymousUserId).accessCode()
            : null;
    return new StiProtectionProcedureData(procedure, accessCode);
  }

  public StiProtectionProcedureData getProcedure(UUID procedureId) {
    return toProcedureData(procedureFinder.findByExternalId(procedureId));
  }

  public void updatePersonDetails(UUID procedureId, PersonData personData) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    Person person = procedure.getPerson();
    person.setGender(personData.gender());
    person.setYearOfBirth(personData.yearOfBirth());
    person.setCountryOfBirth(personData.countryOfBirth());
    person.setInGermanySince(personData.inGermanySince());
    progressEntryUtil.addProgressEntry(procedureId, PERSON_DETAILS_UPDATED);
  }

  public void closeProcedure(StiProtectionProcedure procedure) {
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (procedureStatus.isOpen()) {
      deleteAnonymousUser(procedure);
      procedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    } else {
      throw unexpectedProcedureStatus(procedure.getExternalId(), procedureStatus);
    }
  }

  public void reopenProcedure(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
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
    UUID anonymousUserId = procedure.anonymousUserId();
    if (anonymousUserId == null) {
      throw new BadRequestException("Anonymous user not registered");
    }
    String accessCode =
        citizenAccessCodeUserApi.getCitizenAccessCodeUser(anonymousUserId).accessCode();
    if (!StringUtils.hasText(accessCode)) {
      throw new BadRequestException("Access code cannot be null or blank");
    }
    return accessCode;
  }

  public String generatePin() {
    return RandomStringUtils.secure().nextNumeric(6);
  }

  public void registerAnonymousUser(StiProtectionProcedure procedure, String pin) {
    UUID anonymousUserId = procedure.getAnonymousUserId();
    if (anonymousUserId != null) {
      throw new BadRequestException("User already registered.");
    }
    CitizenAccessCodeUserDto user =
        citizenAccessCodeUserApi.addCitizenAccessCodeUserWithPinCredential(
            new AddCitizenAccessCodeUserWithPinCredentialRequest(pin));
    procedure.setAnonymousUserId(user.userId());
  }

  public void deleteAnonymousUser(StiProtectionProcedure procedure) {
    UUID anonymousUserId = procedure.getAnonymousUserId();
    if (anonymousUserId != null) {
      citizenAccessCodeUserApi.deleteCitizenAccessCodeUser(anonymousUserId);
      procedure.setAnonymousUserId(null);
    }
  }

  public void verifyAnonymousUserPin(UUID procedureId, String pin) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    try {
      UUID userId =
          Optional.ofNullable(procedure.getAnonymousUserId())
              .orElseThrow(() -> new BadRequestException("Procedure has no user"));
      citizenAccessCodeUserApi.verifyCitizenAccessCodeUserCredentials(
          userId, new VerifyCitizenAccessCodeUserCredentialsRequest(CredentialTypeDto.PIN, pin));
    } catch (HttpClientErrorException.BadRequest e) {
      throw new BadRequestException("Invalid credentials");
    }
  }

  public StiProtectionProcedure findByExternalId(UUID procedureId) {
    return procedureFinder.findByExternalId(procedureId);
  }
}
