/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.population.CreateLabelsTask.INFORMATION_BLOCK_LABEL_NAME;
import static de.eshg.schoolentry.population.CreateLabelsTask.SPECIAL_NEEDS_LABEL_NAME;
import static de.eshg.schoolentry.util.ExceptionUtil.notFoundException;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.*;
import static java.util.Comparator.comparing;
import static java.util.Comparator.comparingLong;
import static java.util.Comparator.nullsLast;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.client.ContactClient;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.LocationDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.*;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.procedure.procedures.ProcedureSearchService;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.business.model.*;
import de.eshg.schoolentry.client.ChildUpdate;
import de.eshg.schoolentry.client.PersonClient;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.domain.repository.*;
import de.eshg.schoolentry.domain.repository.Icd10CodeRepository.Icd10FuzzySearchResult;
import de.eshg.schoolentry.importer.ImportType;
import de.eshg.schoolentry.mapper.*;
import de.eshg.schoolentry.pdf.ReportGeneratorConstants;
import de.eshg.schoolentry.pdf.invitation.InvitationGenerator;
import de.eshg.schoolentry.percentiles.PercentileCalculationService;
import de.eshg.schoolentry.util.ExceptionUtil;
import de.eshg.schoolentry.util.ProcedureSortKey;
import de.eshg.schoolentry.util.ProcedureTypeAssignmentHelper;
import de.eshg.schoolentry.util.ProgressEntryUtil;
import de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType;
import de.eshg.schoolentry.util.TaskUtil;
import de.eshg.validation.ValidationUtil;
import java.time.*;
import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Stream;
import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class SchoolEntryService {

  private static final Logger log = LoggerFactory.getLogger(SchoolEntryService.class);

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final PersonRepository personRepository;
  private final HearingTestResultRepository hearingTestResultRepository;
  private final EyeExaminationResultRepository eyeExaminationResultRepository;
  private final SopessExaminationResultRepository sopessExaminationResultRepository;
  private final DevelopmentScreeningResultRepository developmentScreeningResultRepository;
  private final Icd10CodeRepository icd10CodeRepository;
  private final VaccinationStatusRepository vaccinationStatusRepository;
  private final AnamnesisRepository anamnesisRepository;
  private final WaitingRoomRepository waitingRoomRepository;
  private final PersonClient personClient;
  private final ContactClient contactClient;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final AppointmentBlockService appointmentBlockService;
  private final AppointmentBlockProperties appointmentBlockProperties;
  private final Clock clock;
  private final SchoolEntryProperties schoolEntryProperties;
  private final LabelRepository labelRepository;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;
  private final InvitationGenerator invitationGenerator;
  private final PercentileCalculationService percentileCalculationService;
  private final Validator validator;
  private final AuditLogger auditLogger;
  private final ProcedureSearchService<SchoolEntryProcedure> procedureSearchService;
  private final SchoolEntryFeatureToggle schoolEntryFeatureToggle;
  private final ProceduresHelper proceduresHelper;
  private final ProcedureDeletionService<SchoolEntryProcedure> procedureDeletionService;
  private final ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper;
  private final TaskUtil taskUtil;

  public SchoolEntryService(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      PersonRepository personRepository,
      HearingTestResultRepository hearingTestResultRepository,
      EyeExaminationResultRepository eyeExaminationResultRepository,
      SopessExaminationResultRepository sopessExaminationResultRepository,
      DevelopmentScreeningResultRepository developmentScreeningResultRepository,
      Icd10CodeRepository icd10CodeRepository,
      VaccinationStatusRepository vaccinationStatusRepository,
      AnamnesisRepository anamnesisRepository,
      WaitingRoomRepository waitingRoomRepository,
      LabelRepository labelRepository,
      PersonClient personClient,
      ContactClient contactClient,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      AppointmentBlockService appointmentBlockService,
      AppointmentBlockProperties appointmentBlockProperties,
      Clock clock,
      SchoolEntryProperties schoolEntryProperties,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi,
      InvitationGenerator invitationGenerator,
      PercentileCalculationService percentileCalculationService,
      Validator validator,
      AuditLogger auditLogger,
      ProcedureSearchService<SchoolEntryProcedure> procedureSearchService,
      SchoolEntryFeatureToggle schoolEntryFeatureToggle,
      ProceduresHelper proceduresHelper,
      ProcedureDeletionService<SchoolEntryProcedure> procedureDeletionService,
      ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper,
      TaskUtil taskUtil) {
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.personRepository = personRepository;
    this.hearingTestResultRepository = hearingTestResultRepository;
    this.eyeExaminationResultRepository = eyeExaminationResultRepository;
    this.sopessExaminationResultRepository = sopessExaminationResultRepository;
    this.developmentScreeningResultRepository = developmentScreeningResultRepository;
    this.icd10CodeRepository = icd10CodeRepository;
    this.vaccinationStatusRepository = vaccinationStatusRepository;
    this.anamnesisRepository = anamnesisRepository;
    this.waitingRoomRepository = waitingRoomRepository;
    this.labelRepository = labelRepository;
    this.personClient = personClient;
    this.contactClient = contactClient;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.appointmentBlockService = appointmentBlockService;
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.clock = clock;
    this.schoolEntryProperties = schoolEntryProperties;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
    this.invitationGenerator = invitationGenerator;
    this.percentileCalculationService = percentileCalculationService;
    this.validator = validator;
    this.auditLogger = auditLogger;
    this.procedureSearchService = procedureSearchService;
    this.schoolEntryFeatureToggle = schoolEntryFeatureToggle;
    this.proceduresHelper = proceduresHelper;
    this.procedureDeletionService = procedureDeletionService;
    this.procedureTypeAssignmentHelper = procedureTypeAssignmentHelper;
    this.taskUtil = taskUtil;
  }

  public SchoolEntryProcedure createProcedure(CreateProcedureRequest request) {
    return createProceduresWithBookAppointmentTask(
            List.of(
                new ImportProcedureData(
                    request.child(), ProcedureMapper.mapToDomain(request.type()))),
            null,
            null,
            null,
            DataOrigin.MANUAL_CREATION)
        .stream()
        .collect(StreamUtil.toSingleElement());
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
      List<ImportPastProcedureData> pastProcedures,
      UUID schoolId,
      UUID locationId,
      Year schoolYear) {
    List<ImportProcedureData> procedureData =
        pastProcedures.stream().map(ImportPastProcedureData::procedureData).toList();
    List<SchoolEntryProcedure> result = new ArrayList<>();

    Label specialNeedsLabel = fetchSpecialNeedsLabelIfNecessary(procedureData);
    Label informationBlockLabel = fetchInformationBlockLabelIfNecessary(procedureData);

    List<ProcedureIds> createdIds =
        personClient.createPersonsInCentralFile(procedureData, DataOrigin.DATA_IMPORT);
    for (int i = 0; i < pastProcedures.size(); i++) {
      ImportPastProcedureData pastProcedureData = pastProcedures.get(i);
      ImportProcedureData procedure = procedureData.get(i);
      ProcedureIds procedureIds = createdIds.get(i);

      ProcedureType procedureType = procedure.procedureType();
      Anamnesis anamnesis =
          mapAnamnesisData(pastProcedureData.anamnesisData(), procedure.examinationDate());
      VaccinationStatus vaccinationStatus =
          mapVaccinationStatus(pastProcedureData.vaccinationStatusData());

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
              ProcedureStatus.CLOSED,
              anamnesis,
              vaccinationStatus);

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

    Label specialNeedsLabel = fetchSpecialNeedsLabelIfNecessary(procedures);
    Label informationBlockLabel = fetchInformationBlockLabelIfNecessary(procedures);

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
              new VaccinationStatus());

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

  private Label fetchSpecialNeedsLabelIfNecessary(List<ImportProcedureData> procedureData) {
    if (procedureData.stream().anyMatch(ImportProcedureData::isEarlyExamination)) {
      return getSpecialNeedsLabel();
    }
    return null;
  }

  private Label fetchInformationBlockLabelIfNecessary(List<ImportProcedureData> procedureData) {
    if (procedureData.stream().anyMatch(ImportProcedureData::hasInformationBlock)) {
      return getInformationBlockLabel();
    }
    return null;
  }

  private Anamnesis mapAnamnesisData(
      ImportAnamnesisData importAnamnesisData, LocalDate examinationDate) {
    Anamnesis anamnesis = new Anamnesis();
    if (importAnamnesisData == null) {
      return anamnesis;
    }
    anamnesis.setNumberOfSiblings(importAnamnesisData.siblings());
    anamnesis.setNationalityChild(getCountryCode(importAnamnesisData.nationalityChild()));
    anamnesis.setCountryOfBirthFirstParent(
        getCountryCode(importAnamnesisData.countryOfBirthFirstParent()));
    anamnesis.setNationalityFirstParent(
        getCountryCode(importAnamnesisData.nationalityFirstParent()));
    anamnesis.setCountryOfBirthSecondParent(
        getCountryCode(importAnamnesisData.countryOfBirthSecondParent()));
    anamnesis.setNationalitySecondParent(
        getCountryCode(importAnamnesisData.nationalitySecondParent()));
    anamnesis.setHasMigrationBackground(importAnamnesisData.hasMigrationBackground());
    anamnesis.setInDaycareSince(
        approximateInDaycareSince(importAnamnesisData.daycareValue(), examinationDate));
    anamnesis.setPreliminaryCourse(importAnamnesisData.preliminaryCourse());
    anamnesis.setBirthWeight(importAnamnesisData.birthWeight());
    anamnesis.setIntegrationPlace(importAnamnesisData.integrationPlace());
    anamnesis.setEarlySupport(importAnamnesisData.earlySupport());
    anamnesis.setErgotherapy(importAnamnesisData.ergoTherapy());
    anamnesis.setSpeechTherapy(importAnamnesisData.speechTherapy());
    anamnesis.setPhysiotherapy(importAnamnesisData.physioTherapy());
    anamnesis.setChildLanguageScreening(importAnamnesisData.childLanguageScreening());
    anamnesis.setU2(mapBooleanOrNull(importAnamnesisData.u2()));
    anamnesis.setU3(mapBooleanOrNull(importAnamnesisData.u3()));
    anamnesis.setU4(mapBooleanOrNull(importAnamnesisData.u4()));
    anamnesis.setU5(mapBooleanOrNull(importAnamnesisData.u5()));
    anamnesis.setU6(mapBooleanOrNull(importAnamnesisData.u6()));
    anamnesis.setU7(mapBooleanOrNull(importAnamnesisData.u7()));
    anamnesis.setU7a(mapBooleanOrNull(importAnamnesisData.u7a()));
    anamnesis.setU8(mapBooleanOrNull(importAnamnesisData.u8()));
    anamnesis.setU9(mapBooleanOrNull(importAnamnesisData.u9()));
    return anamnesis;
  }

  private VaccinationStatus mapVaccinationStatus(
      ImportVaccinationStatusData importVaccinationStatusData) {
    VaccinationStatus vaccinationStatus = new VaccinationStatus();
    if (importVaccinationStatusData == null) {
      return vaccinationStatus;
    }

    vaccinationStatus.setVaccinationScheme(
        mapVaccinationScheme(importVaccinationStatusData.vaccinationScheme()));
    vaccinationStatus.setTetanus(importVaccinationStatusData.tetanus());
    vaccinationStatus.setDiphtheria(importVaccinationStatusData.diphteria());
    vaccinationStatus.setPertussis(importVaccinationStatusData.pertussis());
    vaccinationStatus.setPolio(importVaccinationStatusData.polio());
    vaccinationStatus.setHib(importVaccinationStatusData.hib());
    vaccinationStatus.setHepatitisB(importVaccinationStatusData.hepatitisB());
    vaccinationStatus.setMmr(importVaccinationStatusData.mmr());
    vaccinationStatus.setVaricella(importVaccinationStatusData.varicella());
    vaccinationStatus.setMeningococcusC(importVaccinationStatusData.meningococcusC());
    vaccinationStatus.setPneumococcus(importVaccinationStatusData.pneumococcus());
    vaccinationStatus.setHepatitisA(importVaccinationStatusData.hepatitisA());
    vaccinationStatus.setTbe(importVaccinationStatusData.tbe());
    vaccinationStatus.setRota(importVaccinationStatusData.rota());
    vaccinationStatus.setMeningococcusB(importVaccinationStatusData.meningococcusB());
    vaccinationStatus.setPerkombiHbv(mapBooleanOrNull(importVaccinationStatusData.perkombiHbv()));
    return vaccinationStatus;
  }

  private static CountryCode getCountryCode(int group) {
    return AnamnesisMapper.mapToDomain(CountryCodeDto.getCountryGroup(group));
  }

  private static LocalDate approximateInDaycareSince(int daycareValue, LocalDate examinationDate) {
    return switch (daycareValue) {
        // TODO ISSUE-6120 map 0 (child hasn't been in daycare)
      case 1 -> examinationDate.minus(Period.ofMonths(9));
      case 2 -> examinationDate.minus(Period.ofMonths(27));
      case 3 -> examinationDate.minus(Period.ofMonths(45));
      default -> null;
    };
  }

  private static BooleanWithUnknown mapBooleanOrNull(Boolean uExaminationValue) {
    if (uExaminationValue == null) {
      return BooleanWithUnknown.UNKNOWN;
    } else if (uExaminationValue.equals(Boolean.TRUE)) {
      return BooleanWithUnknown.TRUE;
    } else {
      return BooleanWithUnknown.FALSE;
    }
  }

  private static VaccinationSchemeValue mapVaccinationScheme(int vaccinationSchemeValue) {
    return switch (vaccinationSchemeValue) {
      case 2 -> VaccinationSchemeValue.SCHEME_2_PLUS_1;
      case 3 -> VaccinationSchemeValue.SCHEME_3_PLUS_1;
      case 9 -> VaccinationSchemeValue.UNKNOWN;
      default ->
          throw new IllegalArgumentException(
              "Vaccination scheme value must only be one of 2, 3, 9");
    };
  }

  private Label getSpecialNeedsLabel() {
    return findSystemLabelOrThrow(SPECIAL_NEEDS_LABEL_NAME);
  }

  private Label getInformationBlockLabel() {
    return findSystemLabelOrThrow(INFORMATION_BLOCK_LABEL_NAME);
  }

  private Label findSystemLabelOrThrow(String labelName) {
    return labelRepository
        .findByName(labelName)
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "System-populated label %s is missing".formatted(labelName)));
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
      VaccinationStatus vaccinationStatus) {
    SchoolEntryProcedure schoolEntryProcedure = new SchoolEntryProcedure();
    schoolEntryProcedure.updateProcedureStatus(initialProcedureStatus, clock, auditLogger);
    schoolEntryProcedure.setProcedureType(type);
    schoolEntryProcedure.setSchoolId(schoolId);
    schoolEntryProcedure.setLocationId(locationId);
    schoolEntryProcedure.setEntryLevel(isEntryLevel);
    schoolEntryProcedure.setExaminationDate(examinationDate);

    buildChild(childIdFromCentralFile, schoolEntryProcedure);

    for (UUID custodianId : custodianIdsFromCentralFile) {
      buildParent(custodianId, schoolEntryProcedure);
    }

    schoolEntryProcedure.setHearingTestResult(new HearingTestResult());
    schoolEntryProcedure.setEyeExaminationResult(new EyeExaminationResult());
    schoolEntryProcedure.setSopessExaminationResult(new SopessExaminationResult());
    schoolEntryProcedure.setDevelopmentScreeningResult(new DevelopmentScreening());
    schoolEntryProcedure.setVaccinationStatus(vaccinationStatus);
    schoolEntryProcedure.setAnamnesis(anamnesis);
    schoolEntryProcedure.setWaitingRoom(new WaitingRoom());
    schoolEntryProcedure.setSchoolYear(schoolYear);

    return schoolEntryProcedureRepository.save(schoolEntryProcedure);
  }

  private static void buildChild(UUID childIdFromCentralFile, SchoolEntryProcedure procedure) {
    Person child = buildPerson(childIdFromCentralFile, PersonType.PATIENT);
    procedure.addRelatedPerson(child);
  }

  private static void buildParent(UUID custodianIdFromCentralFile, SchoolEntryProcedure procedure) {
    Person parent = buildPerson(custodianIdFromCentralFile, PersonType.PARENT);
    procedure.addRelatedPerson(parent);
  }

  private static Person buildPerson(UUID centralFileStateId, PersonType personType) {
    Person person = new Person();
    person.setCentralFileStateId(centralFileStateId);
    person.setPersonType(personType);
    return person;
  }

  ProcedureDetailsData findAndAugmentProcedureByExternalId(UUID procedureId) {
    SchoolEntryProcedure schoolEntryProcedure = findProcedureByExternalId(procedureId);
    return augmentWithDetails(schoolEntryProcedure);
  }

  public List<AppointmentDto> getFreeAppointmentsForProcedure(
      UUID procedureId,
      ProcedureType requestedProcedureType,
      List<UUID> requestedLabelIds,
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
        procedure, earliestStart, null, true, appointmentType, locationId);
  }

  List<AppointmentDto> getFreeAppointmentsForProcedure(
      SchoolEntryProcedure procedure,
      Instant earliestStart,
      Instant latestStart,
      boolean returnCurrentAppointment,
      AppointmentType appointmentType) {
    return getFreeAppointmentsForProcedure(
        procedure, earliestStart, latestStart, returnCurrentAppointment, appointmentType, null);
  }

  List<AppointmentDto> getFreeAppointmentsForProcedure(
      SchoolEntryProcedure procedure,
      Instant earliestStart,
      Instant latestStart,
      boolean returnCurrentAppointment,
      AppointmentType appointmentType,
      UUID locationId) {

    UUID procedureLocationId = getAppointmentLocation(procedure);
    if (appointmentBlockProperties.getLocationSelectionMode() != LocationSelectionMode.NONE
        && procedureLocationId == null
        && locationId == null) {
      return List.of();
    }
    List<AppointmentDto> freeAppointments =
        appointmentBlockService.getFreeAppointments(
            earliestStart,
            latestStart,
            appointmentType,
            locationId == null ? procedureLocationId : locationId);

    Appointment persistedAppointment = procedure.getAppointment();
    if (persistedAppointment != null && returnCurrentAppointment) {
      AppointmentDto appointmentDto =
          de.eshg.lib.appointmentblock.AppointmentMapper.mapAppointmentToDto(persistedAppointment);
      return Stream.concat(freeAppointments.stream(), Stream.of(appointmentDto))
          .distinct()
          .sorted(comparing(AppointmentDto::start))
          .toList();
    }

    return freeAppointments;
  }

  UUID getAppointmentLocation(SchoolEntryProcedure procedure) {
    return switch (appointmentBlockProperties.getLocationSelectionMode()) {
      case NONE -> null;
      case SCHOOL -> procedure.getSchoolId();
      case HEALTH_DEPARTMENT -> procedure.getLocationId();
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
            && labelRepository.existsByNameAndExternalIdIn(
                SPECIAL_NEEDS_LABEL_NAME, requestedLabelIds);
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

    ChildData childData = personClient.fetchChildData(procedure);
    validator.validateChildHasAddress(childData);

    UUID locationId = getAppointmentLocation(procedure);
    if (appointmentBlockProperties.getLocationSelectionMode() != LocationSelectionMode.NONE
        && locationId == null) {
      throw new BadRequestException("Appointment location is missing at procedure.");
    }
    appointmentBlockSlotUtil.updateAppointment(appointmentType, locationId, procedure, start, end);

    CitizenAccessCodeUserDto citizenAccessCodeUser = createOrGetCitizenAccessCodeUser(procedure);
    String accessCode = citizenAccessCodeUser.accessCode();
    Pdf invitation =
        invitationGenerator.generateInvitation(
            accessCode, childData, start, getAppointmentLocation(procedure));
    ProgressEntryUtil.addProgressEntry(
        procedure,
        APPOINTMENT_MODIFIED,
        "Termin %s zu Vorgang zugewiesen"
            .formatted(
                start.atZone(clock.getZone()).format(ReportGeneratorConstants.DATE_FORMAT_DE)),
        invitation);

    TaskUtil.closeSingleTaskOfType(procedure, TaskType.BOOK_APPOINTMENT);
    if (!procedure.hasTaskOfType(TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION)) {
      taskUtil.addOpenTaskOfType(procedure, TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION);
    }
    procedure.getTaskOfType(TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION).updateDueAt(start);

    schoolEntryProcedureRepository.flush();
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

  public BulkCreateAppointmentStatistics createAppointmentsInBulk(List<UUID> procedureIds) {
    BulkCreateAppointmentStatistics stats = new BulkCreateAppointmentStatistics();
    for (UUID procedureId : procedureIds) {
      try {
        SchoolEntryProcedure procedure =
            schoolEntryProcedureRepository
                .findByExternalIdForUpdate(procedureId)
                .orElseThrow(procedureNotFoundException(procedureId));
        Validator.validateProcedureStatusNotClosed(procedure);
        if (procedure.getAppointment() != null) {
          stats.countUnmodified();
        } else {
          Instant now = Instant.now(clock);
          Instant earliestStart =
              now.plus(schoolEntryProperties.getBulkCreateAppointmentsMinLeadTime());
          AppointmentType appointmentType = computeAppointmentType(procedure, null, null);

          List<AppointmentDto> freeAppointments =
              getFreeAppointmentsForProcedure(
                  procedure, earliestStart, null, false, appointmentType);
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

  PagedWaitingRoomProcedures getWaitingRoomProcedures(
      WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {
    WaitingRoomPageSpec pageSpec = createWaitingRoomPageSpec(paginationAndSortParameters);
    return proceduresHelper.getWaitingRoomProcedures(pageSpec);
  }

  private WaitingRoomPageSpec createWaitingRoomPageSpec(
      WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {

    return WaitingRoomMapper.mapToPageSpec(
        paginationAndSortParameters.pageNumberOrFallback(0),
        paginationAndSortParameters.pageSizeOrFallback(25),
        paginationAndSortParameters.sortKeyOrFallback(WaitingRoomSortKey.ID),
        paginationAndSortParameters.sortDirectionOrFallback(SortDirection.DESC));
  }

  PagedProcedures getProcedures(
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
          proceduresHelper
              .augmentWithChildData(allProcedures)
              .sorted(procedureSortComparator(pageSpec.sortKey(), pageSpec.direction()))
              .skip(offset)
              .limit(pageSpec.pageSize())
              .toList();

      return new PagedProcedures(sortedAndFilteredProcedures, allProcedures.size());
    } else {
      return proceduresHelper.getOpenSchoolEntryProcedures(filterParameters, pageSpec);
    }
  }

  private ProcedurePageSpec createPageSpec(
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
        isProcedureDeletable(procedure),
        procedure.getCreatedAt(),
        procedure.getModifiedAt(),
        procedure.getWaitingRoom(),
        procedure.getschoolInfoLetterCreatedAt());
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

  private boolean isProcedureDeletable(SchoolEntryProcedure procedure) {
    return procedure.getAppointment() == null
        && !procedure.getAnamnesis().hasEdits()
        && !procedure.getVaccinationStatus().hasEdits()
        && !procedure.getEyeExaminationResult().hasEdits()
        && !procedure.getHearingTestResult().hasEdits()
        && !procedure.getSopessExaminationResult().hasEdits()
        && !procedure.getDevelopmentScreeningResult().hasEdits();
  }

  public SchoolEntryProcedure updateProcedure(
      SchoolEntryProcedure procedure, UpdateProcedureRequest request) {

    ProcedureType requestedType = ProcedureMapper.mapToDomain(request.procedureType());
    updateProcedureType(procedure, procedure.getProcedureType(), requestedType);

    List<UUID> requestedLabelIds = request.labels();
    List<UUID> persistedLabelIds =
        procedure.getLabels().stream().map(Label::getExternalId).toList();
    updateLabels(procedure, persistedLabelIds, requestedLabelIds);

    updateSchoolId(procedure, procedure.getSchoolId(), request.schoolId());

    if (appointmentBlockProperties.getLocationSelectionMode()
        == LocationSelectionMode.HEALTH_DEPARTMENT) {
      updateLocationId(procedure, procedure.getLocationId(), request.locationId());
    } else {
      if (request.locationId() != null) {
        throw ExceptionUtil.badRequestExceptionForbiddenLocationId();
      }
    }

    AppointmentDto appointment = request.appointment();
    if (appointment == null && procedure.getAppointment() != null) {
      throw new BadRequestException("An appointment can only be changed, but not deleted.");
    }
    if (appointment != null
        && hasAppointmentChanged(procedure, appointment.start(), appointment.end())) {
      AppointmentType appointmentType =
          computeAppointmentType(procedure, requestedType, requestedLabelIds);
      updateAppointment(appointment.start(), appointment.end(), procedure, appointmentType);
    }

    updateIsInvitationSent(
        procedure, procedure.isInvitationSent(), request.isInvitationSent(), appointment);

    updateIsDeceased(procedure, procedure.isDeceased(), request.isDeceased());

    updateDeceased(procedure, procedure.getDeceased(), request.deceased());

    updateSchoolYear(
        procedure,
        procedure.getSchoolYear(),
        ProcedureMapper.mapIntegerToYear(request.schoolYear()));

    ProgressEntryUtil.addProgressEntry(procedure, PROCEDURE_MODIFIED);

    schoolEntryProcedureRepository.flush();
    return procedure;
  }

  private void updateProcedureType(
      SchoolEntryProcedure procedure, ProcedureType persistedType, ProcedureType requestedType) {
    if (requestedType != persistedType) {
      log.info("Modifying procedure type {} to {}", persistedType, requestedType);
      Validator.validateUpdateProcedureType(procedure, requestedType);
      procedure.setProcedureType(requestedType);
      ProgressEntryUtil.addProgressEntry(procedure, PROCEDURE_TYPE_MODIFIED);
    }
  }

  private void updateLabels(
      SchoolEntryProcedure procedure, List<UUID> persistedLabelIds, List<UUID> requestedLabelIds) {
    if (!CollectionUtils.isEqualCollection(requestedLabelIds, persistedLabelIds)) {
      List<Label> labels = labelRepository.findAllByExternalIdInOrderById(requestedLabelIds);
      Validator.validateLabelsExist(
          requestedLabelIds, labels.stream().map(Label::getExternalId).toList());
      procedure.setLabels(labels);
      ProgressEntryUtil.addProgressEntry(procedure, LABELS_MODIFIED);
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
      ProgressEntryUtil.addProgressEntry(procedure, SCHOOL_MODIFIED);
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

    UUID citizenUserId = procedure.getCitizenUserId();
    if (citizenUserId != null) {
      removeCitizenUserAccess(citizenUserId);
      procedure.setCitizenUserId(null);
    }

    schoolEntryProcedureRepository.flush();
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

  public void deleteProcedure(SchoolEntryProcedure procedure) {
    markRelatedPersonsForDeletionInCentralFile(List.of(procedure));
    procedureDeletionService.deleteAndWriteToCemetery(procedure.getExternalId());
  }

  public void deleteProcedures(List<UUID> procedureIds) {
    List<SchoolEntryProcedure> procedures =
        schoolEntryProcedureRepository.findForBatchDeletion(procedureIds);
    markRelatedPersonsForDeletionInCentralFile(procedures);
    procedureDeletionService.bulkDeleteAndWriteToCemetery(
        procedures, SchoolEntryTask.class, Person.class, Facility.class);
  }

  private void markRelatedPersonsForDeletionInCentralFile(List<SchoolEntryProcedure> procedures) {
    UUID[] personIds =
        procedures.stream()
            .map(Procedure::getRelatedPersons)
            .flatMap(List::stream)
            .map(RelatedPerson::getCentralFileStateId)
            .toArray(UUID[]::new);
    if (log.isInfoEnabled()) {
      log.info("Marking central file state(s) {} for deletion", Arrays.toString(personIds));
    }
    personClient.markCentralFileStatesForDeletion(personIds);
    if (log.isInfoEnabled()) {
      log.info("Marked central file state(s) {} for deletion", Arrays.toString(personIds));
    }
  }

  public void updateChildData(
      SchoolEntryProcedure procedure, Person child, UpdatePersonRequest request) {
    UUID currentFileStateId = child.getCentralFileStateId();
    UUID updatedFileStateId = personClient.updateChild(currentFileStateId, request);

    if (!updatedFileStateId.equals(currentFileStateId)) {
      child.setCentralFileStateId(updatedFileStateId);
      ProgressEntryUtil.addProgressEntry(procedure, CHILD_MODIFIED);
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
    ProgressEntryUtil.addProgressEntry(procedure, progressEntryType);

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
    buildParent(centralFileId, procedure);

    ProgressEntryUtil.addProgressEntry(procedure, CUSTODIAN_ADDED);
    schoolEntryProcedureRepository.flush();
  }

  public void updateCustodian(UpdatePersonRequest request, UUID centralFileStateId, Person person) {
    UUID newCentralFileStateId =
        personClient.updatePersonInCentralFile(request, centralFileStateId);

    if (!newCentralFileStateId.equals(centralFileStateId)) {
      person.setCentralFileStateId(newCentralFileStateId);
      ProgressEntryUtil.addProgressEntry(person.getProcedure(), CUSTODIAN_MODIFIED);
      schoolEntryProcedureRepository.flush();
    }
  }

  public void removeCustodian(UUID centralFileStateId, SchoolEntryProcedure procedure) {
    log.info("Marking central file state {} for deletion", centralFileStateId);
    personClient.markCentralFileStatesForDeletion(centralFileStateId);
    log.info("Marked central file state {} for deletion", centralFileStateId);

    Person person =
        procedure.getRelatedPersons().stream()
            .filter(p -> p.getCentralFileStateId().equals(centralFileStateId))
            .findFirst()
            .orElseThrow(notFoundException(Person.class, centralFileStateId));
    procedure.getRelatedPersons().remove(person);

    ProgressEntryUtil.addProgressEntry(procedure, CUSTODIAN_REMOVED);
    schoolEntryProcedureRepository.flush();
  }

  SchoolEntryProcedure findProcedureByExternalIdForUpdate(UUID procedureId, long version) {
    SchoolEntryProcedure procedure =
        schoolEntryProcedureRepository
            .findByExternalIdForUpdate(procedureId)
            .orElseThrow(procedureNotFoundException(procedureId));
    ValidationUtil.validateVersion(version, procedure);
    return procedure;
  }

  Person findChildForUpdate(UUID procedureId, long version) {
    Person child =
        personRepository.findByProcedureExternalIdAndTypeForUpdate(procedureId, PersonType.PATIENT);
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

  public HearingTestResult findHearingTestResultForUpdate(UUID procedureId, long version) {
    HearingTestResult hearingTestResult =
        hearingTestResultRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(procedureNotFoundException(procedureId));
    ValidationUtil.validateVersion(version, hearingTestResult);
    return hearingTestResult;
  }

  public HearingTestResult findHearingTestResult(UUID procedureId) {
    return hearingTestResultRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(procedureNotFoundException(procedureId));
  }

  public EyeExaminationResult findEyeExaminationResultForUpdate(UUID procedureId, long version) {
    EyeExaminationResult eyeExaminationResult =
        eyeExaminationResultRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(procedureNotFoundException(procedureId));
    ValidationUtil.validateVersion(version, eyeExaminationResult);
    return eyeExaminationResult;
  }

  public EyeExaminationResult findEyeExaminationResult(UUID procedureId) {
    return eyeExaminationResultRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(procedureNotFoundException(procedureId));
  }

  public SopessExaminationResult findSopessExaminationResultForUpdate(
      UUID procedureId, long version) {
    SopessExaminationResult sopessExaminationResult =
        sopessExaminationResultRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(procedureNotFoundException(procedureId));
    ValidationUtil.validateVersion(version, sopessExaminationResult);
    return sopessExaminationResult;
  }

  public SopessExaminationResult findSopessExaminationResult(UUID procedureId) {
    return sopessExaminationResultRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(procedureNotFoundException(procedureId));
  }

  public DevelopmentScreening findDevelopmentScreeningResultForUpdate(
      UUID procedureId, long version) {
    DevelopmentScreening developmentScreeningResult =
        developmentScreeningResultRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(procedureNotFoundException(procedureId));
    ValidationUtil.validateVersion(version, developmentScreeningResult);
    return developmentScreeningResult;
  }

  public DevelopmentScreening findDevelopmentScreeningResult(UUID procedureId) {
    return developmentScreeningResultRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(procedureNotFoundException(procedureId));
  }

  public Anamnesis findAnamnesis(UUID procedureId) {
    return anamnesisRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(procedureNotFoundException(procedureId));
  }

  public Anamnesis findAnamnesisForUpdate(UUID procedureId, long version) {
    Anamnesis anamnesis =
        anamnesisRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(procedureNotFoundException(procedureId));
    ValidationUtil.validateVersion(version, anamnesis);
    return anamnesis;
  }

  public List<UUID> collectExistingProcedures(Collection<UUID> externalIds) {
    if (externalIds.isEmpty()) {
      return List.of();
    }
    return schoolEntryProcedureRepository.collectExistingProceduresByExternalIds(externalIds);
  }

  public SchoolEntryProcedure findProcedureByExternalId(UUID procedureId) {
    return schoolEntryProcedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(procedureNotFoundException(procedureId));
  }

  public VaccinationStatus findVaccinationStatusForUpdate(UUID procedureId, Long version) {
    VaccinationStatus vaccinationStatus =
        vaccinationStatusRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(procedureNotFoundException(procedureId));
    ValidationUtil.validateVersion(version, vaccinationStatus);
    return vaccinationStatus;
  }

  public VaccinationStatus findVaccinationStatus(UUID procedureId) {
    return vaccinationStatusRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(procedureNotFoundException(procedureId));
  }

  WaitingRoom findWaitingRoomForUpdate(UUID procedureId, Long version) {
    WaitingRoom waitingRoom =
        waitingRoomRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(procedureNotFoundException(procedureId));
    ValidationUtil.validateVersion(version, waitingRoom);
    return waitingRoom;
  }

  private static Supplier<NotFoundException> procedureNotFoundException(UUID procedureId) {
    return notFoundException(SchoolEntryProcedure.class, procedureId);
  }

  Stream<Icd10FuzzySearchResult> searchIcd10Codes(String searchString, List<String> codes) {
    if (!searchString.isEmpty()) {
      if (searchString.isBlank()) {
        return Stream.empty();
      }
      return icd10CodeRepository.fuzzySearch(searchString);
    } else {
      return icd10CodeRepository.findByCode(codes);
    }
  }

  public Map<PersonKeyAttributes, List<ProcedureWithChildData>> searchForMergeCandidates(
      Set<PersonKeyAttributes> searchAttributes) {
    Map<PersonKeyAttributes, List<SchoolEntryProcedure>> proceduresByPersons =
        procedureSearchService.searchOpenProceduresByPersons(searchAttributes, PersonType.PATIENT);
    return personClient.augmentWithChildData(proceduresByPersons);
  }

  void updateHearingTestResult(
      HearingTestResult persistedHearingTestResult, HearingTestResult newHearingTestResult) {
    copyValues(newHearingTestResult, persistedHearingTestResult);

    ProgressEntryUtil.addProgressEntry(
        persistedHearingTestResult.getProcedure(), HEARING_TEST_MODIFIED);

    hearingTestResultRepository.flush();
  }

  private static void copyValues(HearingTestResult fromResult, HearingTestResult toResult) {
    toResult.setLeftEar(fromResult.getLeftEar());
    toResult.setRightEar(fromResult.getRightEar());
    toResult.setExaminationResult(fromResult.getExaminationResult());
    toResult.setNote(fromResult.getNote());
  }

  void updateEyeExaminationResult(
      EyeExaminationResult persistedEyeExaminationResult,
      EyeExaminationResult newEyeExaminationResult) {
    copyValues(newEyeExaminationResult, persistedEyeExaminationResult);

    ProgressEntryUtil.addProgressEntry(
        persistedEyeExaminationResult.getProcedure(), EYE_EXAMINATION_MODIFIED);

    eyeExaminationResultRepository.flush();
  }

  private static void copyValues(EyeExaminationResult fromResult, EyeExaminationResult toResult) {
    toResult.setLeftEye(fromResult.getLeftEye());
    toResult.setRightEye(fromResult.getRightEye());
    toResult.setEyeExamination(fromResult.getEyeExamination());
    toResult.setLangExamination(fromResult.getLangExamination());
    toResult.setIshiharaExamination(fromResult.getIshiharaExamination());
    toResult.setAmblyopia(fromResult.getAmblyopia());
    toResult.setAstigmatism(fromResult.getAstigmatism());
    toResult.setColorVisionDisorder(fromResult.getColorVisionDisorder());
    toResult.setHyperopia(fromResult.getHyperopia());
    toResult.setMyopia(fromResult.getMyopia());
    toResult.setStrabismus(fromResult.getStrabismus());
    toResult.setOtherDiagnosis(fromResult.getOtherDiagnosis());
    toResult.setNote(fromResult.getNote());
  }

  void updateSopessExaminationResult(
      SopessExaminationResult persistedSopessExaminationResult,
      SopessExaminationResult newSopessExaminationResult) {
    copyValues(newSopessExaminationResult, persistedSopessExaminationResult);

    ProgressEntryUtil.addProgressEntry(
        persistedSopessExaminationResult.getProcedure(), SOPESS_EXAMINATION_MODIFIED);

    sopessExaminationResultRepository.flush();
  }

  private static void copyValues(
      SopessExaminationResult fromResult, SopessExaminationResult toResult) {
    toResult.setJumpCount(fromResult.getJumpCount());
    toResult.setGrossMotorSkills(fromResult.getGrossMotorSkills());
    toResult.setDoctorLetterGrossMotorSkills(fromResult.getDoctorLetterGrossMotorSkills());
    toResult.setVisuoMotor(fromResult.getVisuoMotor());
    toResult.setFineMotorSkills(fromResult.getFineMotorSkills());
    toResult.setDoctorLetterFineMotorSkills(fromResult.getDoctorLetterFineMotorSkills());
    toResult.setHandednessValue(fromResult.getHandednessValue());
    toResult.setVisualPerceptionPoints(fromResult.getVisualPerceptionPoints());
    toResult.setVisualPerceptionResult(fromResult.getVisualPerceptionResult());
    toResult.setPrimaryLanguage(fromResult.getPrimaryLanguage());
    toResult.setGermanKnowledgePrimaryCarer(fromResult.getGermanKnowledgePrimaryCarer());
    toResult.setFamilyLanguage(fromResult.getFamilyLanguage());
    toResult.setGermanKnowledgeChild(fromResult.getGermanKnowledgeChild());
    toResult.setLettersSAndZPoints(fromResult.getLettersSAndZPoints());
    toResult.setFormationSchPoints(fromResult.getFormationSchPoints());
    toResult.setLettersTAndDPoints(fromResult.getLettersTAndDPoints());
    toResult.setFormationChPoints(fromResult.getFormationChPoints());
    toResult.setLettersGAndKPoints(fromResult.getLettersGAndKPoints());
    toResult.setLettersLAndNPoints(fromResult.getLettersLAndNPoints());
    toResult.setLetterRPoints(fromResult.getLetterRPoints());
    toResult.setLetterFAndFormationPfPoints(fromResult.getLetterFAndFormationPfPoints());
    toResult.setLetterBPoints(fromResult.getLetterBPoints());
    toResult.setFormationsTrDrKrGrPoints(fromResult.getFormationsTrDrKrGrPoints());
    toResult.setDoctorLetterVisualPerception(fromResult.getDoctorLetterVisualPerception());
    toResult.setPrepositionPoints(fromResult.getPrepositionPoints());
    toResult.setPluralPoints(fromResult.getPluralPoints());
    toResult.setSpeechResult(fromResult.getSpeechResult());
    toResult.setDoctorLetterSpeech(fromResult.getDoctorLetterSpeech());
    toResult.setPseudowordPoints(fromResult.getPseudowordPoints());
    toResult.setAuditiveProcessingResult(fromResult.getAuditiveProcessingResult());
    toResult.setDoctorLetterAuditiveProcessing(fromResult.getDoctorLetterAuditiveProcessing());
    toResult.setCountingPoints(fromResult.getCountingPoints());
    toResult.setQuantityKnowledgePoints(fromResult.getQuantityKnowledgePoints());
    toResult.setKnowledgeThinkingResult(fromResult.getKnowledgeThinkingResult());
    toResult.setDoctorLetterKnowledgeThinking(fromResult.getDoctorLetterKnowledgeThinking());
    toResult.setSelectiveAttentionPoints(fromResult.getSelectiveAttentionPoints());
    toResult.setPsychologicalBehaviorResult(fromResult.getPsychologicalBehaviorResult());
    toResult.setDoctorLetterPsychologicalBehavior(
        fromResult.getDoctorLetterPsychologicalBehavior());
    toResult.setNote(fromResult.getNote());
  }

  void updateDevelopmentScreeningResult(
      DevelopmentScreening persistedDevelopmentScreeningResult,
      DevelopmentScreening newDevelopmentScreeningResult) {
    boolean heightOrWeightWasUpdated =
        heightOrWeightWasUpdated(
            persistedDevelopmentScreeningResult, newDevelopmentScreeningResult);
    copyValues(newDevelopmentScreeningResult, persistedDevelopmentScreeningResult);
    if (heightOrWeightWasUpdated) {
      PercentilesDto dto =
          percentileCalculationService.getPercentiles(
              persistedDevelopmentScreeningResult.getProcedure(),
              newDevelopmentScreeningResult.getHeight(),
              newDevelopmentScreeningResult.getWeight());
      persistedDevelopmentScreeningResult.setHeightPercentile(dto.getHeightPercentile());
      persistedDevelopmentScreeningResult.setWeightPercentile(dto.getWeightPercentile());
      persistedDevelopmentScreeningResult.setBmi(dto.getBmi());
      persistedDevelopmentScreeningResult.setBmiPercentile(dto.getBmiPercentile());
    }

    ProgressEntryUtil.addProgressEntry(
        persistedDevelopmentScreeningResult.getProcedure(), DEVELOPMENT_SCREENING_MODIFIED);

    developmentScreeningResultRepository.flush();
  }

  private static void copyValues(DevelopmentScreening fromResult, DevelopmentScreening toResult) {
    toResult.setHeight(fromResult.getHeight());
    toResult.setWeight(fromResult.getWeight());
    toResult.setSystole(fromResult.getSystole());
    toResult.setDiastole(fromResult.getDiastole());
    toResult.setNutritionalCondition(fromResult.getNutritionalCondition());
    toResult.setNeurology(fromResult.getNeurology());
    toResult.setRespiratoryCardiovascular(fromResult.getRespiratoryCardiovascular());
    toResult.setSkin(fromResult.getSkin());
    toResult.setMusculatureSkeleton(fromResult.getMusculatureSkeleton());
    toResult.setMetabolism(fromResult.getMetabolism());
    toResult.setAbdomen(fromResult.getAbdomen());
    toResult.setEarNoseThroat(fromResult.getEarNoseThroat());
    toResult.setPhysicalExaminationNote(fromResult.getPhysicalExaminationNote());
    toResult.setChronicDisease(fromResult.getChronicDisease());
    toResult.setDisability(fromResult.getDisability());
    toResult.setDisabilityType(fromResult.getDisabilityType());
    toResult.setHandicapNote(fromResult.getHandicapNote());
    toResult.setFamily(fromResult.getFamily());
    toResult.setNonCompliance(fromResult.getNonCompliance());
    toResult.setSocial(fromResult.getSocial());
    toResult.setMigration(fromResult.getMigration());
    toResult.setOtherRisk(fromResult.getOtherRisk());
    toResult.setReIntroduction(fromResult.getReIntroduction());
    toResult.setSchoolCounselling(fromResult.getSchoolCounselling());
    toResult.setMotorPromotion(fromResult.getMotorPromotion());
    toResult.setEducationalAdvice(fromResult.getEducationalAdvice());
    toResult.setLanguageAdvice(fromResult.getLanguageAdvice());
    toResult.setNutritionalAdvice(fromResult.getNutritionalAdvice());
    toResult.setVaccinationAdvice(fromResult.getVaccinationAdvice());
    toResult.setSocialService(fromResult.getSocialService());
    toResult.setOtherRisk(fromResult.getOtherRisk());
    toResult.setOtherSupport(fromResult.getOtherSupport());
    toResult.setInfoLetter(fromResult.getInfoLetter());
    toResult.setExtraEffort(fromResult.getExtraEffort());
    toResult.setSchoolRecommendation(fromResult.getSchoolRecommendation());
    toResult.setSchoolFeedback(fromResult.getSchoolFeedback());
  }

  void updateVaccinationStatus(
      VaccinationStatus persistedVaccinationStatus, VaccinationStatus newVaccinationStatus) {
    copyValues(newVaccinationStatus, persistedVaccinationStatus);

    ProgressEntryUtil.addProgressEntry(
        persistedVaccinationStatus.getProcedure(), VACCINATION_STATUS_MODIFIED);

    vaccinationStatusRepository.flush();
  }

  private void copyValues(VaccinationStatus fromResult, VaccinationStatus toResult) {
    toResult.setVaccinationScheme(fromResult.getVaccinationScheme());
    toResult.setDiphtheria(fromResult.getDiphtheria());
    toResult.setTetanus(fromResult.getTetanus());
    toResult.setPertussis(fromResult.getPertussis());
    toResult.setHib(fromResult.getHib());
    toResult.setPolio(fromResult.getPolio());
    toResult.setHepatitisB(fromResult.getHepatitisB());
    toResult.setPneumococcus(fromResult.getPneumococcus());
    toResult.setMmr(fromResult.getMmr());
    toResult.setVaricella(fromResult.getVaricella());
    toResult.setMeningococcusB(fromResult.getMeningococcusB());
    toResult.setMeningococcusC(fromResult.getMeningococcusC());
    toResult.setRota(fromResult.getRota());
    toResult.setTbe(fromResult.getTbe());
    toResult.setHepatitisA(fromResult.getHepatitisA());
    toResult.setOtherVaccinations(fromResult.getOtherVaccinations());
    toResult.setVaccinationPassPresented(fromResult.getVaccinationPassPresented());
    toResult.setPerkombiHbv(fromResult.getPerkombiHbv());
    toResult.setMeaslesContraIndication(fromResult.getMeaslesContraIndication());
    toResult.setMeaslesContraIndicationIsPermanent(
        fromResult.getMeaslesContraIndicationIsPermanent());
    toResult.setMeaslesContraIndicationUntil(fromResult.getMeaslesContraIndicationUntil());
  }

  void updateAnamnesis(Anamnesis persistedAnamnesis, Anamnesis newAnamnesis) {
    copyValues(newAnamnesis, persistedAnamnesis);

    ProgressEntryUtil.addProgressEntry(persistedAnamnesis.getProcedure(), ANAMNESIS_MODIFIED);

    anamnesisRepository.flush();
  }

  public void copyValues(Anamnesis fromAnamnesis, Anamnesis toAnamnesis) {
    toAnamnesis.setChildLanguageScreening(fromAnamnesis.getChildLanguageScreening());
    toAnamnesis.setPreliminaryCourse(fromAnamnesis.getPreliminaryCourse());
    toAnamnesis.setBirthWeight(fromAnamnesis.getBirthWeight());
    toAnamnesis.setGestationalAge(fromAnamnesis.getGestationalAge());
    toAnamnesis.setU2(fromAnamnesis.getU2());
    toAnamnesis.setU3(fromAnamnesis.getU3());
    toAnamnesis.setU4(fromAnamnesis.getU4());
    toAnamnesis.setU5(fromAnamnesis.getU5());
    toAnamnesis.setU6(fromAnamnesis.getU6());
    toAnamnesis.setU7(fromAnamnesis.getU7());
    toAnamnesis.setU7a(fromAnamnesis.getU7a());
    toAnamnesis.setU8(fromAnamnesis.getU8());
    toAnamnesis.setU9(fromAnamnesis.getU9());
    toAnamnesis.setEarlySupport(fromAnamnesis.getEarlySupport());
    toAnamnesis.setIntegrationPlace(fromAnamnesis.getIntegrationPlace());
    toAnamnesis.setErgotherapy(fromAnamnesis.getErgotherapy());
    toAnamnesis.setSpeechTherapy(fromAnamnesis.getSpeechTherapy());
    toAnamnesis.setPhysiotherapy(fromAnamnesis.getPhysiotherapy());
    toAnamnesis.setNationalityChild(fromAnamnesis.getNationalityChild());
    toAnamnesis.setCountryOfBirthChild(fromAnamnesis.getCountryOfBirthChild());
    toAnamnesis.setNationalityFirstParent(fromAnamnesis.getNationalityFirstParent());
    toAnamnesis.setCountryOfBirthFirstParent(fromAnamnesis.getCountryOfBirthFirstParent());
    toAnamnesis.setNationalitySecondParent(fromAnamnesis.getNationalitySecondParent());
    toAnamnesis.setCountryOfBirthSecondParent(fromAnamnesis.getCountryOfBirthSecondParent());
    toAnamnesis.setHasMigrationBackground(fromAnamnesis.getHasMigrationBackground());
    toAnamnesis.setInGermanySince(fromAnamnesis.getInGermanySince());
    toAnamnesis.setResponsiblePhysician(fromAnamnesis.getResponsiblePhysician());
    toAnamnesis.setNumberOfSiblings(fromAnamnesis.getNumberOfSiblings());
    toAnamnesis.setSiblingsBirthYears(fromAnamnesis.getSiblingsBirthYears());
    toAnamnesis.setInDaycareSince(fromAnamnesis.getInDaycareSince());
    toAnamnesis.setDaycareName(fromAnamnesis.getDaycareName());
    toAnamnesis.setSchoolName(fromAnamnesis.getSchoolName());
    toAnamnesis.setSpectaclesInFamily(fromAnamnesis.getSpectaclesInFamily());
    toAnamnesis.setChronicIllnessOrDisabilityInFamily(
        fromAnamnesis.getChronicIllnessOrDisabilityInFamily());
    toAnamnesis.setDevelopmentConspicuities(fromAnamnesis.getDevelopmentConspicuities());
    toAnamnesis.setInfancyConspicuities(fromAnamnesis.getInfancyConspicuities());
    toAnamnesis.setSevereIllnesses(fromAnamnesis.getSevereIllnesses());
    toAnamnesis.setAllergies(fromAnamnesis.getAllergies());
    toAnamnesis.setHospitalizationsOrOperations(fromAnamnesis.getHospitalizationsOrOperations());
    toAnamnesis.setUnderMedicalTreatmentFor(fromAnamnesis.getUnderMedicalTreatmentFor());
    toAnamnesis.setRegularMedication(fromAnamnesis.getRegularMedication());
    toAnamnesis.setVisionImpairment(fromAnamnesis.getVisionImpairment());
    toAnamnesis.setHearingImpairment(fromAnamnesis.getHearingImpairment());
    toAnamnesis.setSpeechImpairment(fromAnamnesis.getSpeechImpairment());
    toAnamnesis.setSpectaclesSince(fromAnamnesis.getSpectaclesSince());
    toAnamnesis.setVisionSchoolSince(fromAnamnesis.getVisionSchoolSince());
    toAnamnesis.setHearingAid(fromAnamnesis.getHearingAid());
    toAnamnesis.setSpeechTherapyStart(fromAnamnesis.getSpeechTherapyStart());
    toAnamnesis.setSpeechTherapyEnd(fromAnamnesis.getSpeechTherapyEnd());
    toAnamnesis.setErgoTherapyStart(fromAnamnesis.getErgoTherapyStart());
    toAnamnesis.setErgoTherapyEnd(fromAnamnesis.getErgoTherapyEnd());
    toAnamnesis.setPhysioTherapyStart(fromAnamnesis.getPhysioTherapyStart());
    toAnamnesis.setPhysioTherapyEnd(fromAnamnesis.getPhysioTherapyEnd());
    toAnamnesis.setAdditionalTherapies(fromAnamnesis.getAdditionalTherapies());
    toAnamnesis.setClubSport(fromAnamnesis.getClubSport());
    toAnamnesis.setOtherInterests(fromAnamnesis.getOtherInterests());
    toAnamnesis.setCanSwim(fromAnamnesis.getCanSwim());
    toAnamnesis.setHasSeahorseBadge(fromAnamnesis.getHasSeahorseBadge());
    toAnamnesis.setPersonalConspicuities(fromAnamnesis.getPersonalConspicuities());
  }

  private CitizenAccessCodeUserDto createOrGetCitizenAccessCodeUser(
      SchoolEntryProcedure procedure) {
    if (procedure.getCitizenUserId() != null) {
      log.debug("Citizen User ID already exists.");
      return citizenAccessCodeUserApi.getCitizenAccessCodeUser(procedure.getCitizenUserId());
    }

    CitizenAccessCodeUserDto citizenAccessCodeUser =
        citizenAccessCodeUserApi.addCitizenAccessCodeUser(
            new AddCitizenAccessCodeUserRequest(procedure.getChildIdFromCentralFile()));
    procedure.setCitizenUserId(citizenAccessCodeUser.userId());

    return citizenAccessCodeUser;
  }

  private boolean heightOrWeightWasUpdated(
      DevelopmentScreening existing, DevelopmentScreening updated) {
    return !Objects.equals(existing.getHeight(), updated.getHeight())
        || !Objects.equals(existing.getWeight(), updated.getWeight());
  }

  public List<UUID> mergeProcedures(
      List<MergeProcedureData> mergeDataList,
      ImportType importType,
      UUID schoolId,
      UUID locationId,
      Year schoolYear) {
    if (mergeDataList.isEmpty()) {
      return List.of();
    }

    List<UUID> procedureIds = mergeDataList.stream().map(MergeProcedureData::procedureId).toList();

    try {
      Assert.isTrue(
          !StreamUtil.hasDuplicates(procedureIds.stream()),
          "Merge data contains duplicated procedure IDs");

      Map<UUID, SchoolEntryProcedure> procedures =
          schoolEntryProcedureRepository
              .findByExternalIdsForUpdate(procedureIds)
              .collect(StreamUtil.toLinkedHashMap(SchoolEntryProcedure::getExternalId));

      List<ChildUpdate> childUpdates = new ArrayList<>();
      for (MergeProcedureData mergeData : mergeDataList) {
        UUID procedureId = mergeData.procedureId();
        SchoolEntryProcedure procedure =
            Optional.ofNullable(procedures.get(procedureId))
                .orElseThrow(procedureNotFoundException(procedureId));

        childUpdates.add(
            new ChildUpdate(
                procedure,
                mergeData.placeOfBirth(),
                mergeData.countryOfBirth(),
                mergeData.phoneNumber()));
      }

      List<UUID> failedProcedureIds = personClient.updateChildren(childUpdates);

      for (MergeProcedureData mergeData : mergeDataList) {
        UUID procedureId = mergeData.procedureId();

        SchoolEntryProcedure procedure =
            Optional.ofNullable(procedures.get(procedureId))
                .orElseThrow(procedureNotFoundException(procedureId));

        if (failedProcedureIds.contains(procedureId)) {
          log.debug("Skipping merge of procedure {}. Child update failed", procedureId);
          continue;
        }

        mergeDataForProcedure(procedure, mergeData, schoolId, locationId, schoolYear);
        updateProcedureTypeWithSuggestion(procedure);
        addProgressEntryForMerge(procedure, importType);
      }

      schoolEntryProcedureRepository.flush();

      return failedProcedureIds;
    } catch (Exception e) {
      log.error("Error during merge of data.", e);
      return procedureIds;
    }
  }

  private static void addProgressEntryForMerge(
      SchoolEntryProcedure procedure, ImportType importType) {
    SchoolEntrySystemProgressEntryType progressEntryType =
        switch (importType) {
          case CITIZEN_LIST -> MERGED_DATA_FROM_CITIZEN_LIST;
          case SCHOOL_LIST -> MERGED_DATA_FROM_SCHOOL_LIST;
          case PAST_PROCEDURE_LIST -> throw ExceptionUtil.mergeNotSupportedForPastProcedureImport();
        };
    ProgressEntryUtil.addProgressEntry(procedure, progressEntryType);
  }

  private void mergeDataForProcedure(
      SchoolEntryProcedure procedure,
      MergeProcedureData mergeData,
      UUID schoolId,
      UUID locationId,
      Year schoolYear) {
    if (mergeData.custodians() != null && !mergeData.custodians().isEmpty()) {
      personClient
          .createCustodiansInCentralFile(mergeData.custodians())
          .forEach(custodianId -> buildParent(custodianId, procedure));
    }

    if (mergeData.isEntryLevel() != null) {
      procedure.setEntryLevel(mergeData.isEntryLevel());
    }

    if (mergeData.isEarlyExamination() != null && mergeData.isEarlyExamination()) {
      Label specialNeedsLabel = getSpecialNeedsLabel();

      List<Label> labels = procedure.getLabels();
      if (!labels.contains(specialNeedsLabel)) {
        labels.add(specialNeedsLabel);
      }
    }

    if (schoolId != null) {
      procedure.setSchoolId(schoolId);
    }

    if (locationId != null) {
      procedure.setLocationId(locationId);
    }

    if (schoolYear != null) {
      procedure.setSchoolYear(schoolYear);
    }
  }

  private void updateProcedureTypeWithSuggestion(SchoolEntryProcedure procedure) {
    procedure.setProcedureType(
        procedureTypeAssignmentHelper.suggestProcedureType(
            procedure.isEntryLevel(),
            personClient.fetchChildData(procedure).dateOfBirth(),
            procedure.getSchoolYear()));
  }

  void updateWaitingRoomDetails(
      WaitingRoom persistedWaitingRoom, WaitingRoom requestedWaitingRoom) {
    persistedWaitingRoom.setDescription(requestedWaitingRoom.getDescription());
    persistedWaitingRoom.setStatus(requestedWaitingRoom.getStatus());

    waitingRoomRepository.flush();
  }
}
