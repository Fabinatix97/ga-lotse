/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePersonSearchParameters;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureSearchOverviewDto;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureSearchParameters;
import de.eshg.prostituteprotection.api.UpdateEncryptedPersonalDataRequest;
import de.eshg.prostituteprotection.api.UpdateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.crypto.EncryptedPersonalDataDto;
import de.eshg.prostituteprotection.crypto.PersonalDataEncryptionService;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionTask;
import de.eshg.prostituteprotection.domain.repository.ConsultationRepository;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import de.eshg.prostituteprotection.mapper.AppointmentMapper;
import de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper;
import de.eshg.prostituteprotection.util.ExceptionUtil;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ProstituteProtectionService {

  private final ProstituteProtectionProcedureRepository procedureRepository;
  private final ConsultationRepository consultationRepository;
  private final ProstituteProtectionAppointmentService appointmentService;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final PersonalDataEncryptionService personalDataEncryptionService;

  public ProstituteProtectionService(
      ProstituteProtectionProcedureRepository procedureRepository,
      ConsultationRepository consultationRepository,
      ProstituteProtectionAppointmentService appointmentService,
      Clock clock,
      AuditLogger auditLogger,
      PersonalDataEncryptionService personalDataEncryptionService) {
    this.procedureRepository = procedureRepository;
    this.consultationRepository = consultationRepository;
    this.appointmentService = appointmentService;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.personalDataEncryptionService = personalDataEncryptionService;
  }

  CreateProstituteProtectionProcedureResponse createProcedure(
      CreateProstituteProtectionProcedureRequest request) {
    ProstituteProtectionProcedure prostituteProtectionProcedure =
        ProstituteProtectionMapper.mapRequestToDomain(request);
    prostituteProtectionProcedure.setProcedureType(ProcedureType.PROSTITUTE_PROTECTION);
    prostituteProtectionProcedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    prostituteProtectionProcedure.addTask(createTask());
    prostituteProtectionProcedure.setConsultation(new Consultation());
    prostituteProtectionProcedure.setEncryptedPersonalData(new EncryptedPersonalData());

    appointmentService.bookAppointment(
        prostituteProtectionProcedure, AppointmentMapper.toDataType(request));
    procedureRepository.save(prostituteProtectionProcedure);

    return new CreateProstituteProtectionProcedureResponse(
        prostituteProtectionProcedure.getExternalId());
  }

  void updateProcedure(
      ProstituteProtectionProcedure procedure, UpdateProstituteProtectionProcedureRequest request) {
    ProstituteProtectionMapper.mapRequestToDomain(procedure, request);
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
    ProstituteProtectionMapper.mapPersonalData(procedure, request, encryptedPersonalData);
    procedure.updateProcedureStatus(ProcedureStatus.IN_PROGRESS, clock, auditLogger);
    procedureRepository.flush();
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

    List<ProstituteProtectionProcedureSearchOverviewDto> resultList = new ArrayList<>();
    for (ProstituteProtectionProcedure procedure : pagedProcedures.getContent()) {
      EncryptedPersonalDataDto encryptedPersonalData =
          new EncryptedPersonalDataDto(
              procedure.getEncryptedPersonalData().getHashedPersonIdentifier(),
              procedure.getEncryptedPersonalData().getEncryptedData(),
              procedure.getEncryptedPersonalData().getNonce());

      DecryptedPersonalDataDto decryptedPersonalData =
          personalDataEncryptionService.decrypt(encryptedPersonalData, encryptionKey);
      resultList.add(
          ProstituteProtectionMapper.mapProcedureToSearchOverviewDto(
              procedure, decryptedPersonalData));
    }
    return new PageImpl<>(resultList, pageable, pagedProcedures.getTotalElements());
  }

  public ProstituteProtectionProcedure findByExternalIdOrThrow(UUID procedureId) {
    return procedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Der Vorgang zu ID %s konnte nicht gefunden werden.".formatted(procedureId)));
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
    persistedConsultation.setSupervisedConsultation(newConsultation.isSupervisedConsultation());
    persistedConsultation.setRemark(newConsultation.getRemark());
    persistedConsultation.setLanguageOfConsultation(newConsultation.getLanguageOfConsultation());
    persistedConsultation.setInterpreterConsulted(newConsultation.isInterpreterConsulted());
    persistedConsultation.setInterpreterFirstName(newConsultation.getInterpreterFirstName());
    persistedConsultation.setInterpreterLastName(newConsultation.getInterpreterLastName());
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
}
