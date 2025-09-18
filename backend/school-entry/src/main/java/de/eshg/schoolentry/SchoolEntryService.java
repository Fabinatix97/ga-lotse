/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.population.CreateLabelsTask.SPECIAL_NEEDS_LABEL_NAME;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.*;
import static java.util.Comparator.comparing;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.lib.appointmentblock.AppointmentBlockAvailabilityService;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.LocationDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.procedure.domain.model.*;
import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.business.model.*;
import de.eshg.schoolentry.client.PersonClient;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.domain.repository.*;
import de.eshg.schoolentry.mapper.*;
import de.eshg.schoolentry.pdf.ReportGeneratorConstants;
import de.eshg.schoolentry.pdf.invitation.ChildDataWithPersonIdAndCustodian;
import de.eshg.schoolentry.pdf.invitation.InvitationGenerator;
import de.eshg.schoolentry.util.ExceptionUtil;
import de.eshg.schoolentry.util.ProgressEntryUtil;
import de.eshg.schoolentry.util.SchoolEntryKeyDocumentType;
import de.eshg.schoolentry.util.TaskUtil;
import de.eshg.validation.ValidationUtil;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.*;
import java.util.*;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class SchoolEntryService {

  private static final Logger log = LoggerFactory.getLogger(SchoolEntryService.class);

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final WaitingRoomRepository waitingRoomRepository;
  private final PersonClient personClient;
  private final ContactClient contactClient;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final AppointmentBlockService appointmentBlockService;
  private final AppointmentBlockConfig appointmentBlockConfig;
  private final Clock clock;
  private final AppointmentBlockAvailabilityService appointmentBlockAvailabilityService;
  private final LabelService labelService;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;
  private final InvitationGenerator invitationGenerator;
  private final Validator validator;
  private final AuditLogger auditLogger;
  private final ProgressEntryUtil progressEntryUtil;
  private final TaskUtil taskUtil;

  public SchoolEntryService(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      WaitingRoomRepository waitingRoomRepository,
      LabelService labelService,
      PersonClient personClient,
      ContactClient contactClient,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      AppointmentBlockService appointmentBlockService,
      AppointmentBlockConfig appointmentBlockConfig,
      Clock clock,
      AppointmentBlockAvailabilityService appointmentBlockAvailabilityService,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi,
      InvitationGenerator invitationGenerator,
      Validator validator,
      AuditLogger auditLogger,
      ProgressEntryUtil progressEntryUtil,
      TaskUtil taskUtil) {
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.waitingRoomRepository = waitingRoomRepository;
    this.labelService = labelService;
    this.personClient = personClient;
    this.contactClient = contactClient;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.appointmentBlockService = appointmentBlockService;
    this.appointmentBlockConfig = appointmentBlockConfig;
    this.clock = clock;
    this.appointmentBlockAvailabilityService = appointmentBlockAvailabilityService;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
    this.invitationGenerator = invitationGenerator;
    this.validator = validator;
    this.auditLogger = auditLogger;
    this.progressEntryUtil = progressEntryUtil;
    this.taskUtil = taskUtil;
  }

  public SchoolEntryProcedure createProcedure(CreateProcedureRequest request) {
    UUID createdId = personClient.createPersonInCentralFile(request.child());

    SchoolEntryProcedure createdProcedure =
        saveSchoolEntryProcedure(
            createdId,
            List.of(),
            ProcedureMapper.mapToDomain(request.type()),
            null,
            null,
            null,
            false,
            null,
            ProcedureStatus.OPEN,
            new Anamnesis(),
            new VaccinationStatus(),
            new EyeExaminationResult(),
            new HearingTestResult(),
            new SopessExaminationResult(),
            new DevelopmentScreening());

    taskUtil.addOpenTaskOfType(createdProcedure, TaskType.BOOK_APPOINTMENT);
    return createdProcedure;
  }

  public List<SchoolEntryProcedure> createProceduresWithBookAppointmentTask(
      List<ImportProcedureData> procedures,
      UUID schoolId,
      UUID locationId,
      Year schoolYear,
      DataOrigin dataOrigin) {
    List<SchoolEntryProcedure> createdProcedures =
        createProcedures(
            procedures, schoolId, locationId, schoolYear, dataOrigin, ProcedureStatus.OPEN);
    createdProcedures.forEach(
        procedure -> taskUtil.addOpenTaskOfType(procedure, TaskType.BOOK_APPOINTMENT));
    return createdProcedures;
  }

  public List<SchoolEntryProcedure> createProceduresFromDataImport(
      List<ImportPastProcedureData> pastProcedures, UUID schoolId, Year schoolYear) {
    List<ImportProcedureData> procedureData =
        pastProcedures.stream().map(ImportPastProcedureData::procedureData).toList();
    List<SchoolEntryProcedure> result = new ArrayList<>();

    ProcedureLabel specialNeedsLabel = fetchSpecialNeedsLabelIfNecessary(procedureData);
    ProcedureLabel informationBlockLabel = fetchInformationBlockLabelIfNecessary(procedureData);

    List<ProcedureIds> createdIds =
        personClient.createPersonsInCentralFile(procedureData, DataOrigin.DATA_IMPORT);
    for (int i = 0; i < pastProcedures.size(); i++) {
      ImportPastProcedureData pastProcedureData = pastProcedures.get(i);
      ImportProcedureData procedure = procedureData.get(i);
      ProcedureIds procedureIds = createdIds.get(i);

      SchoolEntryProcedure schoolEntryProcedure =
          saveSchoolEntryProcedure(
              procedureIds.childId(),
              procedureIds.custodianIds(),
              procedure.procedureType(),
              schoolId,
              null,
              schoolYear,
              procedure.isEntryLevel(),
              procedure.examinationDate(),
              ProcedureStatus.CLOSED,
              pastProcedureData.anamnesis(),
              pastProcedureData.vaccinationStatus(),
              pastProcedureData.eyeExaminationResult(),
              pastProcedureData.hearingTestResult(),
              pastProcedureData.sopessExamination(),
              pastProcedureData.developmentScreening());

      if (procedure.isEarlyExamination()) {
        Assert.notNull(specialNeedsLabel, "specialNeedsLabel must be fetched at this point");
        schoolEntryProcedure.addLabel(specialNeedsLabel);
      }
      if (procedure.hasInformationBlock()) {
        Assert.notNull(
            informationBlockLabel, "informationBlockLabel must be fetched at this point");
        schoolEntryProcedure.addLabel(informationBlockLabel);
      }
      result.add(schoolEntryProcedure);
    }

    return result;
  }

  public List<SchoolEntryProcedure> createProcedures(
      List<ImportProcedureData> procedures,
      UUID schoolId,
      UUID locationId,
      Year schoolYear,
      DataOrigin dataOrigin,
      ProcedureStatus initialProcedureStatus) {
    List<SchoolEntryProcedure> result = new ArrayList<>();

    ProcedureLabel specialNeedsLabel = fetchSpecialNeedsLabelIfNecessary(procedures);
    ProcedureLabel informationBlockLabel = fetchInformationBlockLabelIfNecessary(procedures);

    List<ProcedureIds> createdIds = personClient.createPersonsInCentralFile(procedures, dataOrigin);
    for (int i = 0; i < procedures.size(); i++) {
      ImportProcedureData procedure = procedures.get(i);
      ProcedureIds procedureIds = createdIds.get(i);

      ProcedureType procedureType = procedure.procedureType();

      SchoolEntryProcedure schoolEntryProcedure =
          saveSchoolEntryProcedure(
              procedureIds.childId(),
              procedureIds.custodianIds(),
              procedureType,
              schoolId,
              locationId,
              schoolYear,
              procedure.isEntryLevel(),
              procedure.examinationDate(),
              initialProcedureStatus,
              new Anamnesis(),
              new VaccinationStatus(),
              new EyeExaminationResult(),
              new HearingTestResult(),
              new SopessExaminationResult(),
              new DevelopmentScreening());

      if (procedure.isEarlyExamination()) {
        Assert.notNull(specialNeedsLabel, "specialNeedsLabel must be fetched at this point");
        schoolEntryProcedure.addLabel(specialNeedsLabel);
      }
      if (procedure.hasInformationBlock()) {
        Assert.notNull(
            informationBlockLabel, "informationBlockLabel must be fetched at this point");
        schoolEntryProcedure.addLabel(informationBlockLabel);
      }
      result.add(schoolEntryProcedure);
    }

    return result;
  }

  private ProcedureLabel fetchSpecialNeedsLabelIfNecessary(
      List<ImportProcedureData> procedureData) {
    if (procedureData.stream().anyMatch(ImportProcedureData::isEarlyExamination)) {
      return labelService.getSpecialNeedsLabel();
    }
    return null;
  }

  private ProcedureLabel fetchInformationBlockLabelIfNecessary(
      List<ImportProcedureData> procedureData) {
    if (procedureData.stream().anyMatch(ImportProcedureData::hasInformationBlock)) {
      return labelService.getInformationBlockLabel();
    }
    return null;
  }

  private SchoolEntryProcedure saveSchoolEntryProcedure(
      UUID childIdFromCentralFile,
      List<UUID> custodianIdsFromCentralFile,
      ProcedureType type,
      UUID schoolId,
      UUID locationId,
      Year schoolYear,
      boolean isEntryLevel,
      LocalDate examinationDate,
      ProcedureStatus initialProcedureStatus,
      Anamnesis anamnesis,
      VaccinationStatus vaccinationStatus,
      EyeExaminationResult eyeExaminationResult,
      HearingTestResult hearingTestResult,
      SopessExaminationResult sopessExaminationResult,
      DevelopmentScreening developmentScreening) {
    SchoolEntryProcedure schoolEntryProcedure = new SchoolEntryProcedure();

    // We set the createdAt explicitly to make sure that it is not after closedAt
    Instant now = Instant.now(clock);
    schoolEntryProcedure.setCreatedAt(now);
    schoolEntryProcedure.updateProcedureStatus(initialProcedureStatus, now, auditLogger);
    schoolEntryProcedure.setProcedureType(type);
    schoolEntryProcedure.setSchoolId(schoolId);
    schoolEntryProcedure.setLocationId(locationId);
    schoolEntryProcedure.setEntryLevel(isEntryLevel);
    schoolEntryProcedure.setExaminationDate(examinationDate);

    buildChild(childIdFromCentralFile, schoolEntryProcedure);

    for (UUID custodianId : custodianIdsFromCentralFile) {
      buildCustodian(custodianId, schoolEntryProcedure);
    }

    schoolEntryProcedure.setHearingTestResult(hearingTestResult);
    schoolEntryProcedure.setEyeExaminationResult(eyeExaminationResult);
    schoolEntryProcedure.setSopessExaminationResult(sopessExaminationResult);
    schoolEntryProcedure.setDevelopmentScreeningResult(developmentScreening);
    schoolEntryProcedure.setVaccinationStatus(vaccinationStatus);
    schoolEntryProcedure.setAnamnesis(anamnesis);
    schoolEntryProcedure.setWaitingRoom(new WaitingRoom());
    schoolEntryProcedure.setSchoolYear(schoolYear);

    return schoolEntryProcedureRepository.save(schoolEntryProcedure);
  }

  private static void buildChild(UUID childIdFromCentralFile, SchoolEntryProcedure procedure) {
    Person child = buildPerson(childIdFromCentralFile, Person.PERSON_TYPE_USED_FOR_CHILDREN);
    procedure.addRelatedPerson(child);
  }

  public static void buildCustodian(
      UUID custodianIdFromCentralFile, SchoolEntryProcedure procedure) {
    Person custodian =
        buildPerson(custodianIdFromCentralFile, Person.PERSON_TYPE_USED_FOR_CUSTODIANS);
    procedure.addRelatedPerson(custodian);
  }

  private static Person buildPerson(UUID centralFileStateId, PersonType personType) {
    Person person = new Person();
    person.setCentralFileStateId(centralFileStateId);
    person.setPersonType(personType);
    return person;
  }

  private List<SchoolEntryProcedure> findProceduresByExternalIdForUpdate(List<UUID> procedureIds) {
    return schoolEntryProcedureRepository.findByExternalIdsForUpdate(procedureIds).toList();
  }

  SchoolEntryProcedure findProcedureByExternalIdForUpdate(UUID procedureId, long version) {
    SchoolEntryProcedure procedure =
        schoolEntryProcedureRepository
            .findByExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, procedure);
    return procedure;
  }

  public SchoolEntryProcedure findProcedureByExternalId(UUID procedureId) {
    return schoolEntryProcedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  ProcedureDetailsData findAndAugmentProcedureByExternalId(UUID procedureId) {
    SchoolEntryProcedure schoolEntryProcedure = findProcedureByExternalId(procedureId);
    return augmentWithDetails(schoolEntryProcedure);
  }

  ProcedureDetailsData augmentWithDetails(SchoolEntryProcedure procedure) {
    ProcedureWithPersonDetailsData personDetails = personClient.augmentWithPersonDetails(procedure);
    SchoolDto school = getSchool(procedure);
    LocationDto location = getLocation(procedure);
    return new ProcedureDetailsData(
        procedure.getId(),
        procedure.getExternalId(),
        procedure.getVersion(),
        procedure.getProcedureType(),
        personDetails.child(),
        personDetails.custodians(),
        procedure.getLabels(),
        procedure.getAppointment(),
        school,
        location,
        procedure.isEntryLevel(),
        procedure.isInvitationSent(),
        procedure.isDeceased(),
        procedure.getDeceased(),
        procedure.getSchoolYear(),
        procedure.getProcedureStatus(),
        procedure.isDeletable(),
        procedure.getCreatedAt(),
        procedure.getModifiedAt(),
        procedure.getWaitingRoom(),
        procedure.getSchoolInfoLetterCreatedAt(),
        procedure.hasInformationBlock(),
        procedure.hasBeenClosed(),
        isPastProcedure(procedure));
  }

  private boolean isPastProcedure(SchoolEntryProcedure procedure) {
    return procedure.getExaminationDate() != null;
  }

  private SchoolDto getSchool(SchoolEntryProcedure procedure) {
    UUID schoolId = procedure.getSchoolId();
    if (schoolId == null) {
      return null;
    }
    ContactDto contact = contactClient.getContact(schoolId);
    return new SchoolDto(schoolId, contact.name());
  }

  private LocationDto getLocation(SchoolEntryProcedure procedure) {
    UUID locationId = procedure.getLocationId();
    if (locationId == null) {
      return null;
    }
    ContactDto contact = contactClient.getContact(locationId);
    return new LocationDto(locationId, contact.name());
  }

  public List<AppointmentDto> getFreeAppointmentsForProcedure(
      UUID procedureId,
      ProcedureType requestedProcedureType,
      List<UUID> requestedLabelIds,
      UUID schoolId,
      UUID locationId) {
    SchoolEntryProcedure procedure = findProcedureByExternalId(procedureId);
    Instant earliestStart = Instant.now(clock);
    AppointmentType appointmentType;
    try {
      appointmentType =
          computeAppointmentType(procedure, requestedProcedureType, requestedLabelIds);
    } catch (BadRequestException e) {
      log.info(
          "Failed to compute appointment type, therefore no free appointments can be found.", e);
      return List.of();
    }
    return getFreeAppointmentsForProcedure(
        procedure, earliestStart, appointmentType, schoolId, locationId);
  }

  List<AppointmentDto> getFreeAppointmentsForProcedure(
      SchoolEntryProcedure procedure,
      Instant earliestStart,
      AppointmentType appointmentType,
      UUID schoolId,
      UUID locationId) {

    if (procedure.hasBeenClosed()) {
      log.info(
          "Returning an empty list of free appointments, because the procedure has been closed before.");
      return List.of();
    }

    UUID appointmentLocationId = computeLocationIdForAppointment(procedure, schoolId, locationId);

    if (appointmentBlockConfig.getLocationSelectionMode() != LocationSelectionMode.NONE
        && appointmentLocationId == null) {
      return List.of();
    }

    List<AppointmentDto> freeAppointments =
        appointmentBlockService.getFreeAppointments(
            earliestStart, null, appointmentType, appointmentLocationId, null);

    Appointment persistedAppointment = procedure.getAppointment();
    if (persistedAppointment != null) {
      AppointmentDto appointmentDto =
          de.eshg.lib.appointmentblock.AppointmentMapper.mapAppointmentToDto(persistedAppointment);
      return Stream.concat(freeAppointments.stream(), Stream.of(appointmentDto))
          .distinct()
          .sorted(comparing(AppointmentDto::start))
          .toList();
    }

    return freeAppointments;
  }

  List<AppointmentDto> getFreeAppointmentsWithAvailability(
      SchoolEntryProcedure procedure,
      Instant earliestStart,
      Instant latestStart,
      AppointmentType appointmentType,
      Boolean availableForCitizen,
      Boolean availableForBulkBooking) {

    if (procedure.hasBeenClosed()) {
      log.info(
          "Returning an empty list of free appointments, because the procedure has been closed before.");
      return List.of();
    }

    UUID appointmentLocationId = computeLocationIdForAppointment(procedure, null, null);

    if (appointmentBlockConfig.getLocationSelectionMode() != LocationSelectionMode.NONE
        && appointmentLocationId == null) {
      return List.of();
    }

    return appointmentBlockService.getFreeAppointmentsWithAvailability(
        earliestStart,
        latestStart,
        appointmentType,
        appointmentLocationId,
        availableForCitizen,
        availableForBulkBooking);
  }

  UUID getAppointmentLocation(SchoolEntryProcedure procedure) {
    return switch (appointmentBlockConfig.getLocationSelectionMode()) {
      case NONE -> null;
      case SCHOOL -> procedure.getSchoolId();
      case HEALTH_DEPARTMENT -> procedure.getLocationId();
    };
  }

  private UUID computeLocationIdForAppointment(
      SchoolEntryProcedure procedure, UUID requestedSchoolId, UUID requestedLocationId) {
    return switch (appointmentBlockConfig.getLocationSelectionMode()) {
      case NONE -> null;
      case SCHOOL -> requestedSchoolId == null ? procedure.getSchoolId() : requestedSchoolId;
      case HEALTH_DEPARTMENT ->
          requestedLocationId == null ? procedure.getLocationId() : requestedLocationId;
    };
  }

  public AppointmentType computeAppointmentType(
      SchoolEntryProcedure procedure,
      ProcedureType requestedProcedureType,
      List<UUID> requestedLabelIds) {
    ProcedureType procedureType =
        requestedProcedureType != null ? requestedProcedureType : procedure.getProcedureType();

    if (isDraftProcedureType(procedureType)) {
      log.debug("Detected draft procedure type when trying to compute the AppointmentType");
      throw new BadRequestException("No appointments available for Draft procedure types");
    }

    boolean isSpecialNeedsLabelInRequest =
        requestedLabelIds != null
            && labelService.contains(requestedLabelIds, SPECIAL_NEEDS_LABEL_NAME);
    log.debug("Check for special needs label in request returned {}", isSpecialNeedsLabelInRequest);

    boolean procedureHasSpecialNeedsLabelInPersistence =
        procedure.hasLabel(SPECIAL_NEEDS_LABEL_NAME);
    log.debug(
        "Check for special needs label in persistence returned {}",
        procedureHasSpecialNeedsLabelInPersistence);

    AppointmentType appointmentType =
        isSpecialNeedsLabelInRequest
                || (requestedLabelIds == null && procedureHasSpecialNeedsLabelInPersistence)
            ? AppointmentType.SPECIAL_NEEDS
            : AppointmentMapper.mapToAppointmentType(procedureType);

    log.debug("Computed AppointmentType {}", appointmentType);
    return appointmentType;
  }

  private boolean isDraftProcedureType(ProcedureType procedureType) {
    return procedureType == ProcedureType.DRAFT_SCHOOL_IMPORT
        || procedureType == ProcedureType.DRAFT_CITIZEN_OFFICE_IMPORT;
  }

  public void updateAppointment(
      Instant start, Instant end, SchoolEntryProcedure procedure, AppointmentType appointmentType) {
    updateAppointment(start, end, procedure, appointmentType, null);
  }

  public void updateAppointment(
      Instant start,
      Instant end,
      SchoolEntryProcedure procedure,
      AppointmentType appointmentType,
      UUID custodianId) {

    ChildDataWithPersonIdAndCustodian childDataWithPersonIdAndCustodian =
        personClient.fetchChildDataWithPersonIdAndRecipientAddress(procedure, custodianId);

    UUID locationId = getAppointmentLocation(procedure);
    if (appointmentBlockConfig.getLocationSelectionMode() != LocationSelectionMode.NONE
        && locationId == null) {
      throw new BadRequestException("Appointment location is missing at procedure.");
    }
    appointmentBlockSlotUtil.updateAppointment(
        appointmentType, locationId, null, procedure, start, end);

    CitizenAccessCodeUserDto citizenAccessCodeUser = createOrGetCitizenAccessCodeUser(procedure);
    String accessCode = citizenAccessCodeUser.accessCode();
    Pdf invitation =
        invitationGenerator.generateInvitation(
            accessCode,
            childDataWithPersonIdAndCustodian,
            start,
            getAppointmentLocation(procedure));
    progressEntryUtil.addProgressEntry(
        procedure,
        APPOINTMENT_MODIFIED,
        getAppointmentChangeDescription(start, custodianId),
        invitation,
        SchoolEntryKeyDocumentType.INVITATION);

    TaskUtil.closeSingleTaskOfType(procedure, TaskType.BOOK_APPOINTMENT);
    if (!procedure.hasTaskOfType(TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION)) {
      taskUtil.addOpenTaskOfType(procedure, TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION);
    } else if (procedure.getSchoolInfoLetterCreatedAt() == null) {
      TaskUtil.reopenSingleTaskOfType(procedure, TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION);
    }
    procedure.getTaskOfType(TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION).updateDueAt(start);

    schoolEntryProcedureRepository.flush();
  }

  private String getAppointmentChangeDescription(Instant start, UUID custodianId) {
    String changeDescription =
        "Termin %s zu Vorgang zugewiesen"
            .formatted(
                start.atZone(clock.getZone()).format(ReportGeneratorConstants.DATE_FORMAT_DE));
    if (custodianId == null) {
      return changeDescription;
    } else {
      return changeDescription + " und an PSB adressiert";
    }
  }

  public void removeAppointment(SchoolEntryProcedure procedure) {
    appointmentBlockSlotUtil.removeAppointment(procedure);

    removeCitizenUserAccessIfPresent(procedure);
    resetWaitingRoomData(procedure);

    TaskUtil.closeOptionalTaskOfType(procedure, TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION);
    TaskUtil.reopenSingleTaskOfType(procedure, TaskType.BOOK_APPOINTMENT);
  }

  private static boolean hasAppointmentChanged(
      SchoolEntryProcedure procedure, Instant start, Instant end) {
    Appointment appointment = procedure.getAppointment();
    if (appointment == null) {
      return true;
    }
    return !(appointment.getAppointmentStart().equals(start)
        && appointment.getAppointmentEnd().equals(end));
  }

  private CitizenAccessCodeUserDto createOrGetCitizenAccessCodeUser(
      SchoolEntryProcedure procedure) {
    if (procedure.getCitizenUserId() != null) {
      log.debug("Citizen User ID already exists.");
      return citizenAccessCodeUserApi.getCitizenAccessCodeUser(procedure.getCitizenUserId());
    }

    CitizenAccessCodeUserDto citizenAccessCodeUser =
        citizenAccessCodeUserApi.addCitizenAccessCodeUserWithDateOfBirthCredential(
            new AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest(
                procedure.getChildIdFromCentralFile()));
    procedure.setCitizenUserId(citizenAccessCodeUser.userId());

    return citizenAccessCodeUser;
  }

  public BulkCreateAppointmentStatistics createAppointmentsInBulk(List<UUID> procedureIds) {
    BulkCreateAppointmentStatistics stats = new BulkCreateAppointmentStatistics();
    for (UUID procedureId : procedureIds) {
      try {
        SchoolEntryProcedure procedure =
            schoolEntryProcedureRepository
                .findByExternalIdForUpdate(procedureId)
                .orElseThrow(ExceptionUtil::procedureNotFoundException);
        ProcedureValidator.validateProcedureStatusNotClosed(procedure);
        if (procedure.getAppointment() != null) {
          stats.countUnmodified();
        } else {
          Instant now = Instant.now(clock);
          Instant earliestStart =
              now.plus(
                  Duration.ofDays(
                      appointmentBlockAvailabilityService
                          .getDefaultLeadTimes()
                          .bulkCreateAppointmentsMinLeadTime()));
          AppointmentType appointmentType = computeAppointmentType(procedure, null, null);

          List<AppointmentDto> freeAppointments =
              getFreeAppointmentsWithAvailability(
                  procedure, earliestStart, null, appointmentType, null, true);
          if (freeAppointments.isEmpty()) {
            stats.countError();
          } else {
            AppointmentDto appointment = freeAppointments.getFirst();
            updateAppointment(appointment.start(), appointment.end(), procedure, appointmentType);
            stats.countCreated();
          }
        }
      } catch (Exception e) {
        log.info("Error in bulk appointment creation: ", e);
        stats.countError();
      }
    }
    return stats;
  }

  public byte[] zipInvitationsForProcedures(List<UUID> procedureIds) throws IOException {
    List<File> files =
        schoolEntryProcedureRepository.findInvitationLettersForProcedures(
            procedureIds, SchoolEntryKeyDocumentType.INVITATION.name());

    if (procedureIds.size() != files.size()) {
      throw new BadRequestException(
          "Unexpected number of invitations (possible causes: procedures not found, duplicate procedure ids, procedures without appointment)");
    }

    try (ByteArrayOutputStream out = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(out)) {
      for (int i = 0; i < files.size(); i++) {
        File file = files.get(i);
        ZipEntry nextEntry = new ZipEntry("%02d_%s".formatted(i + 1, file.getFileName()));
        zip.putNextEntry(nextEntry);
        zip.write(file.getFileContent().getContent());
        zip.closeEntry();
      }
      zip.finish();
      return out.toByteArray();
    }
  }

  public SchoolEntryProcedure updateProcedure(
      SchoolEntryProcedure procedure, UpdateProcedureRequest request) {

    ProcedureType requestedType = ProcedureMapper.mapToDomain(request.procedureType());
    updateProcedureType(procedure, procedure.getProcedureType(), requestedType);

    List<UUID> requestedLabelIds = request.procedureLabels();
    List<UUID> persistedLabelIds =
        procedure.getLabels().stream().map(ProcedureLabel::getExternalId).toList();
    updateLabels(procedure, persistedLabelIds, requestedLabelIds);

    updateSchoolId(procedure, procedure.getSchoolId(), request.schoolId());

    if (appointmentBlockConfig.getLocationSelectionMode()
        == LocationSelectionMode.HEALTH_DEPARTMENT) {
      updateLocationId(procedure, procedure.getLocationId(), request.locationId());
    } else {
      if (request.locationId() != null) {
        throw ExceptionUtil.badRequestExceptionForbiddenLocationId();
      }
    }

    AppointmentDto appointment = request.appointment();
    if (appointment == null && procedure.getAppointment() != null) {
      removeAppointment(procedure);
    }
    if (appointment != null
        && (hasAppointmentChanged(procedure, appointment.start(), appointment.end())
            || request.custodianId() != null)) {
      if (procedure.hasBeenClosed()) {
        throw new BadRequestException(
            "An appointment cannot be updated, when the procedure has been closed before.");
      }
      AppointmentType appointmentType =
          computeAppointmentType(procedure, requestedType, requestedLabelIds);
      updateAppointment(
          appointment.start(),
          appointment.end(),
          procedure,
          appointmentType,
          request.custodianId());
    }

    updateIsInvitationSent(
        procedure, procedure.isInvitationSent(), request.isInvitationSent(), appointment);

    updateIsDeceased(procedure, procedure.isDeceased(), request.isDeceased());

    updateDeceased(procedure, procedure.getDeceased(), request.deceased());

    updateSchoolYear(
        procedure,
        procedure.getSchoolYear(),
        ProcedureMapper.mapIntegerToYear(request.schoolYear()));

    progressEntryUtil.addProgressEntry(procedure, PROCEDURE_MODIFIED);

    schoolEntryProcedureRepository.flush();
    return procedure;
  }

  private void updateProcedureType(
      SchoolEntryProcedure procedure, ProcedureType persistedType, ProcedureType requestedType) {
    if (requestedType != persistedType) {
      log.info("Modifying procedure type {} to {}", persistedType, requestedType);
      Validator.validateUpdateProcedureType(procedure, requestedType);
      procedure.setProcedureType(requestedType);
      progressEntryUtil.addProgressEntry(procedure, PROCEDURE_TYPE_MODIFIED);
    }
  }

  private void updateLabels(
      SchoolEntryProcedure procedure, List<UUID> persistedLabelIds, List<UUID> requestedLabelIds) {
    if (!CollectionUtils.isEqualCollection(requestedLabelIds, persistedLabelIds)) {
      List<ProcedureLabel> labels = labelService.findByExternalIds(requestedLabelIds);
      Validator.validateLabelsExist(
          requestedLabelIds, labels.stream().map(ProcedureLabel::getExternalId).toList());
      procedure.setLabels(labels);
      progressEntryUtil.addProgressEntry(procedure, LABELS_MODIFIED);
    }
  }

  private void updateIsInvitationSent(
      SchoolEntryProcedure procedure,
      boolean persistedInvitationSent,
      boolean requestedInvitationSent,
      AppointmentDto appointment) {
    if (persistedInvitationSent != requestedInvitationSent) {
      Validator.validateInvitationAppointmentIntegrity(requestedInvitationSent, appointment);
      log.info(
          "Modifying invitation sent {} to {}", persistedInvitationSent, requestedInvitationSent);
      procedure.setIsInvitationSent(requestedInvitationSent);
    }
  }

  private void updateSchoolId(
      SchoolEntryProcedure procedure, UUID persistedSchoolId, UUID requestedSchoolId) {
    if (!Objects.equals(persistedSchoolId, requestedSchoolId)) {
      if (requestedSchoolId != null) {
        validator.validateSchoolExists(requestedSchoolId);
      }
      log.info("Modifying school {} to {}", procedure.getSchoolId(), requestedSchoolId);
      procedure.setSchoolId(requestedSchoolId);
      progressEntryUtil.addProgressEntry(procedure, SCHOOL_MODIFIED);
    }
  }

  private void updateLocationId(
      SchoolEntryProcedure procedure, UUID persistedLocationId, UUID requestedLocationId) {
    if (!Objects.equals(persistedLocationId, requestedLocationId)) {
      if (requestedLocationId != null) {
        validator.validateHealthDepartmentExists(requestedLocationId);
      }
      log.info("Modifying location {} to {}", procedure.getLocationId(), requestedLocationId);
      procedure.setLocationId(requestedLocationId);
    }
  }

  private void updateIsDeceased(
      SchoolEntryProcedure procedure, boolean persistedIsDeceased, boolean requestedIsDeceased) {
    if (persistedIsDeceased != requestedIsDeceased) {
      log.info("Modifying isDeceased {} to {}", persistedIsDeceased, requestedIsDeceased);
      procedure.setIsDeceased(requestedIsDeceased);
    }
  }

  private void updateDeceased(
      SchoolEntryProcedure procedure, LocalDate persistedDeceased, LocalDate requestedDeceased) {
    if (requestedDeceased != persistedDeceased) {
      if (!procedure.isDeceased() && requestedDeceased != null) {
        throw new BadRequestException("A date cannot be set if isDeceased is false");
      } else {
        validator.validateDateTodayOrPast(requestedDeceased);
        log.info("Modifying deceased date {} to {}", persistedDeceased, requestedDeceased);
        procedure.setDeceased(requestedDeceased);
      }
    }
  }

  private void updateSchoolYear(
      SchoolEntryProcedure procedure, Year persistedSchoolYear, Year requestedSchoolYear) {
    if (!Objects.equals(persistedSchoolYear, requestedSchoolYear)) {
      validator.validateSchoolYear(requestedSchoolYear);
      log.info("Modifying schoolYear {} to {}", persistedSchoolYear, requestedSchoolYear);
      procedure.setSchoolYear(requestedSchoolYear);
    }
  }

  public void closeProcedure(SchoolEntryProcedure procedure) {
    procedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);

    removeCitizenUserAccessIfPresent(procedure);

    schoolEntryProcedureRepository.flush();
  }

  private void removeCitizenUserAccessIfPresent(SchoolEntryProcedure procedure) {
    UUID citizenUserId = procedure.getCitizenUserId();
    if (citizenUserId != null) {
      removeCitizenUserAccess(citizenUserId);
      procedure.setCitizenUserId(null);
    }
  }

  private void resetWaitingRoomData(SchoolEntryProcedure procedure) {
    WaitingRoom waitingRoom = procedure.getWaitingRoom();
    waitingRoom.setStatus(null);
    waitingRoom.setDescription(null);
  }

  private void removeCitizenUserAccess(UUID citizenUserId) {
    try {
      CitizenAccessCodeUserDto citizenUser =
          citizenAccessCodeUserApi.getCitizenAccessCodeUser(citizenUserId);
      citizenAccessCodeUserApi.deleteCitizenAccessCodeUser(citizenUser.userId());
    } catch (HttpClientErrorException.NotFound ignored) {
      // Access Code User is not present, so there is nothing to do for deletion
    }
  }

  public SchoolEntryProcedure reopenProcedure(UUID procedureId, long version) {
    SchoolEntryProcedure procedure = findProcedureByExternalIdForUpdate(procedureId, version);
    Validator.validateProcedureStatusIsClosed(procedure);
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);

    schoolEntryProcedureRepository.flush();
    return procedure;
  }

  WaitingRoom findWaitingRoomForUpdate(UUID procedureId, Long version) {
    WaitingRoom waitingRoom =
        waitingRoomRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, waitingRoom);
    return waitingRoom;
  }

  void updateWaitingRoomDetails(
      WaitingRoom persistedWaitingRoom, WaitingRoom requestedWaitingRoom) {
    persistedWaitingRoom.setDescription(requestedWaitingRoom.getDescription());
    persistedWaitingRoom.setStatus(requestedWaitingRoom.getStatus());

    waitingRoomRepository.flush();
  }

  public Stream<ProcedureDetailsData> findByPersonId(UUID personId) {
    List<UUID> personFileStateIds = personClient.getPersonFileStatesAssociatedWith(personId);

    return schoolEntryProcedureRepository
        .findByRelatedPersonsCentralFileStateIds(
            personFileStateIds, Person.PERSON_TYPE_USED_FOR_CHILDREN)
        .stream()
        .map(this::augmentWithDetails);
  }

  public UpdateProceduresBulkResponse updateProceduresWithLabels(
      Map<UUID, Long> procedureIdsAndVersion, List<UUID> labelIds) {
    BulkUpdateProceduresStatistics stats = new BulkUpdateProceduresStatistics();

    List<ProcedureLabel> requestedLabels = labelService.findByExternalIds(labelIds);
    Validator.validateLabelsExist(
        labelIds, requestedLabels.stream().map(ProcedureLabel::getExternalId).toList());

    List<SchoolEntryProcedure> procedures =
        findProceduresByExternalIdForUpdate(procedureIdsAndVersion.keySet().stream().toList());

    for (SchoolEntryProcedure procedure : procedures) {
      try {
        ValidationUtil.validateVersion(
            procedureIdsAndVersion.get(procedure.getExternalId()), procedure);
        ProcedureValidator.validateProcedureStatusNotClosed(procedure);
      } catch (Exception e) {
        log.info("Error in bulk label update: ", e);
        stats.countError();
        continue;
      }

      List<ProcedureLabel> persistedLabels = procedure.getLabels();

      if (CollectionUtils.isSubCollection(requestedLabels, persistedLabels)) {
        stats.countUnmodified();
      } else {
        procedure.setLabels(
            Stream.of(persistedLabels, requestedLabels)
                .flatMap(Collection::stream)
                .distinct()
                .toList());
        progressEntryUtil.addProgressEntry(procedure, LABELS_MODIFIED);
        stats.countUpdated();
      }
    }
    return stats.mapToResponse();
  }
}
