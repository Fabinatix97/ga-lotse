/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.SortDirection;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.prostituteprotection.api.CreateCertificateRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.DownloadCertificateRequest;
import de.eshg.prostituteprotection.api.EncryptedFileOverviewDto;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePersonSearchParameters;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureSearchOverviewDto;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureSearchParameters;
import de.eshg.prostituteprotection.api.UpdateEncryptedPersonalDataRequest;
import de.eshg.prostituteprotection.api.UpdateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.UserNameDto;
import de.eshg.prostituteprotection.api.WaitingRoomProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.api.WaitingRoomSortKey;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.crypto.EncryptedFileDataDto;
import de.eshg.prostituteprotection.crypto.EncryptedPersonalDataDto;
import de.eshg.prostituteprotection.crypto.PersonalDataDecryptionException;
import de.eshg.prostituteprotection.crypto.PersonalDataEncryptionService;
import de.eshg.prostituteprotection.domain.data.ProstituteProtectionProcedureWithAugmentedData;
import de.eshg.prostituteprotection.domain.data.WaitingRoomProcedureData;
import de.eshg.prostituteprotection.domain.model.CertificateType;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.EncryptedFile;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionTask;
import de.eshg.prostituteprotection.domain.model.WaitingRoom;
import de.eshg.prostituteprotection.domain.repository.ConsultationRepository;
import de.eshg.prostituteprotection.domain.repository.EncryptedFileRepository;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import de.eshg.prostituteprotection.domain.repository.WaitingRoomRepository;
import de.eshg.prostituteprotection.mapper.AppointmentMapper;
import de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper;
import de.eshg.prostituteprotection.mapper.WaitingRoomMapper;
import de.eshg.prostituteprotection.util.ExceptionUtil;
import de.eshg.prostituteprotection.util.ProgressEntryUtil;
import de.eshg.prostituteprotection.util.ProstituteProtectionProgressEntryType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ProstituteProtectionService {

  public static final int VALIDITY_AGE_THRESHHOLD = 21;
  public static final int VALIDITY_PERIOD_SHORT = 6;
  public static final int VALIDITY_PERIOD_REGULAR = 12;
  private final ProstituteProtectionProcedureRepository procedureRepository;
  private final ConsultationRepository consultationRepository;
  private final EncryptedFileRepository encryptedFileRepository;
  private final WaitingRoomRepository waitingRoomRepository;
  private final ProstituteProtectionAppointmentService appointmentService;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final PersonalDataEncryptionService personalDataEncryptionService;
  private final UserApi userApi;
  private final ProgressEntryUtil progressEntryUtil;

  public ProstituteProtectionService(
      ProstituteProtectionProcedureRepository procedureRepository,
      ConsultationRepository consultationRepository,
      EncryptedFileRepository encryptedFileRepository,
      WaitingRoomRepository waitingRoomRepository,
      ProstituteProtectionAppointmentService appointmentService,
      Clock clock,
      AuditLogger auditLogger,
      PersonalDataEncryptionService personalDataEncryptionService,
      UserApi userApi,
      ProgressEntryUtil progressEntryUtil) {
    this.procedureRepository = procedureRepository;
    this.consultationRepository = consultationRepository;
    this.encryptedFileRepository = encryptedFileRepository;
    this.waitingRoomRepository = waitingRoomRepository;
    this.appointmentService = appointmentService;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.personalDataEncryptionService = personalDataEncryptionService;
    this.userApi = userApi;
    this.progressEntryUtil = progressEntryUtil;
  }

  CreateProstituteProtectionProcedureResponse createProcedure(
      CreateProstituteProtectionProcedureRequest request) {
    ProstituteProtectionProcedure prostituteProtectionProcedure =
        ProstituteProtectionMapper.mapRequestToDomain(request);
    initialiseProcedure(prostituteProtectionProcedure);
    prostituteProtectionProcedure.addTask(createTask());

    appointmentService.bookAppointment(
        prostituteProtectionProcedure, AppointmentMapper.toDataType(request));
    procedureRepository.save(prostituteProtectionProcedure);

    return new CreateProstituteProtectionProcedureResponse(
        prostituteProtectionProcedure.getExternalId());
  }

  void validateConsultant(UUID consultantId) {
    if (consultantId != null) {
      ProstituteProtectionValidator.validateConsultantIsOfCorrectGroup(
          userApi
              .getUsersByGroup(TechnicalGroup.PROSTITUTE_PROTECTION_CONSULTANT.getKeycloakName())
              .users(),
          consultantId);
    }
  }

  public void initialiseProcedure(ProstituteProtectionProcedure prostituteProtectionProcedure) {
    prostituteProtectionProcedure.setProcedureType(ProcedureType.PROSTITUTE_PROTECTION);
    prostituteProtectionProcedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    prostituteProtectionProcedure.setConsultation(new Consultation());
    prostituteProtectionProcedure.setEncryptedPersonalData(new EncryptedPersonalData());
    prostituteProtectionProcedure.setWaitingRoom(new WaitingRoom());
  }

  void updateProcedure(
      ProstituteProtectionProcedure procedure, UpdateProstituteProtectionProcedureRequest request) {
    procedure.setConsultationType(
        ProstituteProtectionMapper.mapConsultationType(request.consultationType()));
    procedureRepository.flush();
  }

  void updateAgeAtConsultation(
      ProstituteProtectionProcedure procedure, DecryptedPersonalDataDto personalData) {
    procedure.setAgeAtConsultation(
        calculateAgeAtConsultation(procedure.getAppointmentStart(), personalData.dateOfBirth()));
    procedureRepository.flush();
  }

  private Integer calculateAgeAtConsultation(Instant appointmentStart, LocalDate dateOfBirth) {
    if (appointmentStart == null || dateOfBirth == null) {
      return null;
    }
    LocalDate dateOfConsultation = appointmentStart.atZone(ZoneId.systemDefault()).toLocalDate();

    return (int) ChronoUnit.YEARS.between(dateOfBirth, dateOfConsultation);
  }

  void updateEncryptedPersonalDataInProcedure(
      ProstituteProtectionProcedure procedure, UpdateEncryptedPersonalDataRequest request) {
    EncryptedPersonalDataDto encryptedPersonalData =
        personalDataEncryptionService.encrypt(
            new DecryptedPersonalDataDto(
                request.firstName(), request.lastName(), request.dateOfBirth()));
    ProstituteProtectionValidator.validateEncryptedData(procedure, encryptedPersonalData);
    ProstituteProtectionMapper.mapPersonalData(procedure, request, encryptedPersonalData);
    procedure.updateProcedureStatus(ProcedureStatus.IN_PROGRESS, clock, auditLogger);
    procedureRepository.flush();
  }

  DecryptedPersonalDataDto decryptPersonalData(
      ProstituteProtectionProcedure procedure, CreateCertificateRequest request) {
    try {
      return personalDataEncryptionService.decrypt(
          procedure.getEncryptedPersonalData(),
          request.firstName(),
          request.lastName(),
          request.dateOfBirth());
    } catch (PersonalDataDecryptionException e) {
      throw new BadRequestException("Error reading personal data", e.getMessage());
    }
  }

  void encryptAndSaveFile(
      ProstituteProtectionProcedure procedure,
      CreateCertificateRequest request,
      byte[] file,
      boolean isRegistration) {
    EncryptedFileDataDto encryptedFileDataDto =
        personalDataEncryptionService.encryptFile(
            new DecryptedPersonalDataDto(
                request.firstName(), request.lastName(), request.dateOfBirth()),
            file);
    EncryptedFile encryptedFile = new EncryptedFile();
    encryptedFile.setEncryptedData(encryptedFileDataDto.data());
    encryptedFile.setNonce(encryptedFileDataDto.nonce());
    encryptedFile.setProcedure(procedure);
    encryptedFile.setCreatedAt(Instant.now(clock));
    encryptedFile.setWithAlias(request.withAlias());
    encryptedFile.setCertificateType(
        isRegistration ? CertificateType.SECTION_7 : CertificateType.SECTION_10);

    LocalDate appointmentDay =
        procedure.getAppointmentStart().atZone(clock.getZone()).toLocalDate();
    if (ChronoUnit.YEARS.between(request.dateOfBirth(), appointmentDay) < VALIDITY_AGE_THRESHHOLD) {
      encryptedFile.setValidUntil(appointmentDay.plusMonths(VALIDITY_PERIOD_SHORT));
    } else {
      encryptedFile.setValidUntil(appointmentDay.plusMonths(VALIDITY_PERIOD_REGULAR));
    }

    procedure.addEncryptedFile(encryptedFile);
    procedureRepository.flush();
  }

  byte[] decryptFile(EncryptedFile encryptedFile, DownloadCertificateRequest request) {
    byte[] encryptionKey =
        personalDataEncryptionService.generateEncryptionKey(
            request.firstName(), request.lastName(), request.dateOfBirth());
    return personalDataEncryptionService.decryptFile(
        new EncryptedFileDataDto(encryptedFile.getEncryptedData(), encryptedFile.getNonce()),
        encryptionKey);
  }

  private ProstituteProtectionTask createTask() {
    ProstituteProtectionTask task = new ProstituteProtectionTask();
    task.setTaskType(TaskType.PROSTITUTE_PROTECTION);
    task.setTaskStatus(TaskStatus.OPEN);
    task.assign(
        CurrentUserHelper.getCurrentUserId(),
        CurrentUserHelper.getCurrentUserId(),
        Instant.now(clock));
    return task;
  }

  public Page<ProstituteProtectionProcedure> getProcedures(
      ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters,
      ProstituteProtectionProcedureSearchParameters searchParameters) {
    ProcedureSpecification specification =
        new ProcedureSpecification(paginationAndSortParameters, searchParameters.alias());
    PageRequest pageable =
        PageRequest.of(
            paginationAndSortParameters.pageNumber(), paginationAndSortParameters.pageSize());

    return procedureRepository.findAll(specification, pageable);
  }

  public List<EncryptedFileOverviewDto> getEncryptedFilesForProcedure(UUID procedureId) {
    ProstituteProtectionProcedure procedure = findByExternalIdOrThrow(procedureId);
    List<EncryptedFile> encryptedFiles =
        encryptedFileRepository.findByProcedureIdOrderByCreatedAtAscIdAsc(procedure.getId());

    return encryptedFiles.stream()
        .map(ProstituteProtectionMapper::mapEncryptedFileToOverviewDto)
        .toList();
  }

  public Page<ProstituteProtectionProcedureSearchOverviewDto> searchProcedures(
      ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters,
      ProstituteProtectionProcedurePersonSearchParameters searchParameters) {
    byte[] encryptionKey =
        personalDataEncryptionService.generateEncryptionKey(
            searchParameters.firstName(),
            searchParameters.lastName(),
            searchParameters.dateOfBirth());
    byte[] hashedPersonIdentifier =
        personalDataEncryptionService.generateHashedPersonIdentifier(encryptionKey);

    PersonSearchSpecification specification =
        new PersonSearchSpecification(paginationAndSortParameters, hashedPersonIdentifier);
    PageRequest pageable =
        PageRequest.of(
            paginationAndSortParameters.pageNumber(), paginationAndSortParameters.pageSize());

    Page<ProstituteProtectionProcedure> pagedProcedures =
        procedureRepository.findAll(specification, pageable);

    List<ProstituteProtectionProcedure> procedures = pagedProcedures.getContent();
    Map<UUID, UserNameDto> users = getConsultantAndCreatorUsers(procedures);

    List<ProstituteProtectionProcedureSearchOverviewDto> resultList = new ArrayList<>();
    for (ProstituteProtectionProcedure procedure : procedures) {
      EncryptedPersonalDataDto encryptedPersonalData =
          new EncryptedPersonalDataDto(
              procedure.getEncryptedPersonalData().getHashedPersonIdentifier(),
              procedure.getEncryptedPersonalData().getEncryptedData(),
              procedure.getEncryptedPersonalData().getNonce());

      DecryptedPersonalDataDto decryptedPersonalData =
          personalDataEncryptionService.decrypt(encryptedPersonalData, encryptionKey);

      String creatorName = formatUserName(creatorId(procedure), users);
      String consultantName = formatUserName(procedure.getConsultantId(), users);

      resultList.add(
          ProstituteProtectionMapper.mapProcedureToSearchOverviewDto(
              procedure, decryptedPersonalData, creatorName, consultantName));
    }
    return new PageImpl<>(resultList, pageable, pagedProcedures.getTotalElements());
  }

  private Map<UUID, UserNameDto> getConsultantAndCreatorUsers(
      List<ProstituteProtectionProcedure> procedures) {
    Set<UUID> userIds = getConsultantsAndCreatorsIds(procedures);
    if (userIds.isEmpty()) {
      return Collections.emptyMap();
    }
    return resolveUsers(userIds);
  }

  private Set<UUID> getConsultantsAndCreatorsIds(List<ProstituteProtectionProcedure> procedures) {
    Set<UUID> userIds = new HashSet<>();
    for (ProstituteProtectionProcedure procedure : procedures) {
      userIds.add(creatorId(procedure));
      userIds.add(procedure.getConsultantId());
    }
    return userIds.stream().filter(Objects::nonNull).collect(Collectors.toSet());
  }

  private UUID creatorId(ProstituteProtectionProcedure procedure) {
    return procedure.getProgressEntries().stream()
        .filter(SystemProgressEntry.class::isInstance)
        .map(SystemProgressEntry.class::cast)
        .filter(
            entry ->
                BasicSystemProgressEntryType.CREATED
                    .name()
                    .equals(entry.getSystemProgressEntryType()))
        .findFirst()
        .map(SystemProgressEntry::getTriggeredBy)
        .orElse(null);
  }

  private String formatUserName(UUID userId, Map<UUID, UserNameDto> users) {
    if (userId != null && users.containsKey(userId)) {
      UserNameDto user = users.get(userId);
      return "%s %s".formatted(user.firstName(), user.lastName());
    }

    return null;
  }

  public ProstituteProtectionProcedureWithAugmentedData findAndAugment(UUID procedureId) {
    ProstituteProtectionProcedure procedure = findByExternalIdOrThrow(procedureId);
    return augmentWithDetails(procedure);
  }

  public ProstituteProtectionProcedureWithAugmentedData augmentWithDetails(
      ProstituteProtectionProcedure procedure) {
    UUID creatorId = creatorId(procedure);
    Map<UUID, UserNameDto> userDtos =
        resolveUsers(getConsultantsAndCreatorsIds(List.of(procedure)));
    return new ProstituteProtectionProcedureWithAugmentedData(
        procedure, userDtos.get(procedure.getConsultantId()), userDtos.get(creatorId));
  }

  public Map<UUID, UserNameDto> resolveUsers(Set<UUID> userIds) {
    return userApi.getUsersBulk(new GetUsersRequest(userIds, true)).users().stream()
        .collect(
            Collectors.toMap(
                UserDto::userId,
                user -> new UserNameDto(user.userId(), user.firstName(), user.lastName())));
  }

  public ProstituteProtectionProcedure findByExternalIdOrThrow(UUID procedureId) {
    return procedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Der Vorgang zu ID %s konnte nicht gefunden werden.".formatted(procedureId)));
  }

  public EncryptedFile findEncryptedFileOrThrow(UUID procedureId, UUID encryptedFileId) {
    return procedureRepository
        .findEncryptedFile(procedureId, encryptedFileId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Das Zertifikat zu ID %s konnte nicht gefunden werden."
                        .formatted(encryptedFileId)));
  }

  public Consultation findConsultation(UUID procedureId) {
    return consultationRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  public Consultation findConsultationForUpdate(UUID procedureId, long version) {
    Consultation consultation =
        consultationRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, consultation);
    return consultation;
  }

  public void updateConsultation(Consultation persistedConsultation, Consultation newConsultation) {
    copyValues(persistedConsultation, newConsultation);
    consultationRepository.flush();
  }

  private void copyValues(Consultation persistedConsultation, Consultation newConsultation) {
    persistedConsultation.setLegalAdvices(newConsultation.isLegalAdvices());
    persistedConsultation.setHealthAndSocialInsurance(newConsultation.isHealthAndSocialInsurance());
    persistedConsultation.setConsultingServices(newConsultation.isConsultingServices());
    persistedConsultation.setEmergencyHelp(newConsultation.isEmergencyHelp());
    persistedConsultation.setTaxLiability(newConsultation.isTaxLiability());
    persistedConsultation.setClearing(newConsultation.isClearing());
    persistedConsultation.setInformationMaterial(newConsultation.isInformationMaterial());
    persistedConsultation.setPredicament(newConsultation.isPredicament());
    persistedConsultation.setDiseasePrevention(newConsultation.isDiseasePrevention());
    persistedConsultation.setBirthControl(newConsultation.isBirthControl());
    persistedConsultation.setPregnancy(newConsultation.isPregnancy());
    persistedConsultation.setAlcoholAndDrugUsage(newConsultation.isAlcoholAndDrugUsage());
    persistedConsultation.setReferral(newConsultation.isReferral());
    persistedConsultation.setLanguageOfConsultation(newConsultation.getLanguageOfConsultation());
    persistedConsultation.setInterpreterConsulted(newConsultation.isInterpreterConsulted());
    persistedConsultation.setInterpreterFirstName(newConsultation.getInterpreterFirstName());
    persistedConsultation.setInterpreterLastName(newConsultation.getInterpreterLastName());
  }

  public WaitingRoom findWaitingRoomForUpdate(UUID procedureId, long version) {
    WaitingRoom waitingRoom =
        waitingRoomRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, waitingRoom);
    return waitingRoom;
  }

  public void updateWaitingRoom(WaitingRoom persistedWaitingRoom, WaitingRoom newWaitingRoom) {
    copyValues(persistedWaitingRoom, newWaitingRoom);
    waitingRoomRepository.flush();
  }

  private void copyValues(WaitingRoom persistedWaitingRoom, WaitingRoom newWaitingRoom) {
    persistedWaitingRoom.setDescription(newWaitingRoom.getDescription());
    persistedWaitingRoom.setStatus(newWaitingRoom.getStatus());
  }

  public ProstituteProtectionProcedure findByExternalIdForUpdate(UUID procedureId, long version) {
    ProstituteProtectionProcedure procedure = findByExternalIdOrThrow(procedureId);
    ValidationUtil.validateVersion(version, procedure);
    return procedure;
  }

  public void closeProcedure(ProstituteProtectionProcedure procedure) {
    procedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    procedureRepository.flush();
  }

  public void abortProcedure(ProstituteProtectionProcedure procedure) {
    procedure.updateProcedureStatus(ProcedureStatus.ABORTED, clock, auditLogger);
  }

  public void abortProcedureAndFlush(ProstituteProtectionProcedure procedure) {
    abortProcedure(procedure);
    procedureRepository.flush();
  }

  public void setCertificateWithAliasCreated(ProstituteProtectionProcedure procedure) {
    procedure.setCertificateWithAliasCreated(true);
    procedureRepository.flush();
  }

  public PagedWaitingRoomProcedures getWaitingRoomProcedures(
      WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {
    WaitingRoomPageSpec pageSpec =
        WaitingRoomMapper.mapToPageSpec(
            paginationAndSortParameters.pageNumberOrFallback(0),
            paginationAndSortParameters.pageSizeOrFallback(25),
            paginationAndSortParameters.sortKeyOrFallback(WaitingRoomSortKey.ID),
            paginationAndSortParameters.sortDirectionOrFallback(SortDirection.DESC));

    WaitingRoomSpecification waitingRoomSpecification =
        new WaitingRoomSpecification(pageSpec.sortKey(), pageSpec.direction());
    Page<ProstituteProtectionProcedure> procedures =
        procedureRepository.findAll(
            waitingRoomSpecification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
    List<WaitingRoomProcedureData> procedureData =
        augmentWithWaitingRoomData(procedures.getContent()).toList();
    return new PagedWaitingRoomProcedures(procedureData, procedures.getTotalElements());
  }

  private Stream<WaitingRoomProcedureData> augmentWithWaitingRoomData(
      List<ProstituteProtectionProcedure> procedures) {
    return procedures.stream()
        .map(
            procedure -> {
              WaitingRoom waitingRoom = procedure.getWaitingRoom();
              return new WaitingRoomProcedureData(
                  procedure.getExternalId(),
                  procedure.getPersonalData().getAlias(),
                  waitingRoom,
                  waitingRoom.getModifiedAt());
            });
  }

  /**
   * Adds a system progress entry to a given procedure. If the procedure is in a closed state, it
   * updates the procedure status to "in progress" before adding the entry and restores the previous
   * status afterward.
   *
   * <p>There is a requirement to download a certificate for a closed procedure for renewal.
   * However, the progress entry service validates the procedure is not closed to permit adding a
   * progress entry. For the use case above we decided to flip the procedure state to permit adding
   * a progress entry for downloaded cert. This will also add audit log entries regarding procedure
   * status change. Temporary status changes that are immediately reverted create "ghost" states in
   * audit trails that can compromise the legal or protective integrity of the record.
   *
   * <p>Instead of toggling the state, the addSystemProgressEntry method should likely be modified
   * to accept a procedure regardless of its current state, or there should be a concept to
   * customise the validation logic depending on the use case.
   *
   * @param procedure the {@code ProstituteProtectionProcedure} to which the progress entry will be
   *     added
   * @param progressEntryType the type of progress entry being added, represented by {@code
   *     ProstituteProtectionProgressEntryType}
   * @param description the textual description of the progress entry
   */
  public void addSystemProgressEntry(
      ProstituteProtectionProcedure procedure,
      ProstituteProtectionProgressEntryType progressEntryType,
      String description) {
    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (!procedureStatus.isOpen()) {
      // The call of `progressEntryUtil.addSystemProgressEntry` requires the procedure
      // to be in a not-closed state. Otherwise, adding a progress entry will fail.
      procedure.updateProcedureStatus(ProcedureStatus.IN_PROGRESS, clock, auditLogger);
    }
    progressEntryUtil.addSystemProgressEntry(procedure, progressEntryType, description);
    procedure.updateProcedureStatus(procedureStatus, clock, auditLogger);
  }
}
