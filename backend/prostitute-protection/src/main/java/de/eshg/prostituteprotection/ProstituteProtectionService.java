/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.SortDirection;
import de.eshg.domain.model.SequencedBaseEntity_;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.persistence.SpecificationUtil;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.api.ProstitutionProtectionProcedureSortKey;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData_;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure_;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionTask;
import de.eshg.prostituteprotection.domain.repository.ConsultationRepository;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import de.eshg.prostituteprotection.mapper.AppointmentMapper;
import de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper;
import de.eshg.prostituteprotection.util.ExceptionUtil;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.validation.ValidationUtil;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class ProstituteProtectionService {

  private final ProstituteProtectionProcedureRepository procedureRepository;
  private final ConsultationRepository consultationRepository;
  private final ProstituteProtectionAppointmentService appointmentService;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public ProstituteProtectionService(
      ProstituteProtectionProcedureRepository procedureRepository,
      ConsultationRepository consultationRepository,
      ProstituteProtectionAppointmentService appointmentService,
      Clock clock,
      AuditLogger auditLogger) {
    this.procedureRepository = procedureRepository;
    this.consultationRepository = consultationRepository;
    this.appointmentService = appointmentService;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  CreateProstituteProtectionProcedureResponse createProcedure(
      CreateProstituteProtectionProcedureRequest request) {
    // ToDo: Find optional anonymized Person in repo and map it to procedure
    ProstituteProtectionProcedure prostituteProtectionProcedure =
        ProstituteProtectionMapper.mapRequestToDomain(request);
    prostituteProtectionProcedure.setProcedureType(ProcedureType.PROSTITUTE_PROTECTION);
    prostituteProtectionProcedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    prostituteProtectionProcedure.addTask(createTask());
    prostituteProtectionProcedure.setConsultation(new Consultation());

    appointmentService.createAppointment(
        prostituteProtectionProcedure, AppointmentMapper.toDataType(request));
    procedureRepository.save(prostituteProtectionProcedure);

    return new CreateProstituteProtectionProcedureResponse(
        prostituteProtectionProcedure.getExternalId());
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
      ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters) {
    SortDirection sortDirection = paginationAndSortParameters.sortDirection();

    Specification<ProstituteProtectionProcedure> spec =
        (root, query, criteriaBuilder) -> {
          Set<Order> orders = new LinkedHashSet<>();
          orders.add(
              SpecificationUtil.getOrder(
                  sortDirection,
                  criteriaBuilder,
                  mapToSortExpression(
                      paginationAndSortParameters.sortKey(),
                      sortDirection,
                      root,
                      criteriaBuilder)));
          orders.add(
              SpecificationUtil.getOrder(
                  sortDirection, criteriaBuilder, root.get(SequencedBaseEntity_.ID)));
          Assert.notNull(query, "query must not be null");
          query.orderBy(orders.stream().toList());

          return criteriaBuilder.or(
              criteriaBuilder.equal(root.get(Procedure_.PROCEDURE_STATUS), ProcedureStatus.OPEN),
              criteriaBuilder.equal(
                  root.get(Procedure_.PROCEDURE_STATUS), ProcedureStatus.IN_PROGRESS));
        };

    return procedureRepository.findAll(
        spec,
        PageRequest.of(
            paginationAndSortParameters.pageNumber(), paginationAndSortParameters.pageSize()));
  }

  private static Expression<?> mapToSortExpression(
      ProstitutionProtectionProcedureSortKey sortKey,
      SortDirection sortDirection,
      Root<ProstituteProtectionProcedure> root,
      CriteriaBuilder criteriaBuilder) {
    return switch (sortKey) {
      case ALIAS ->
          nullsLastString(
              root.join(ProstituteProtectionProcedure_.ENCRYPTED_PERSONAL_DATA, JoinType.LEFT)
                  .get(EncryptedPersonalData_.ALIAS),
              criteriaBuilder,
              sortDirection);
      case APPOINTMENT_START ->
          nullsLastInstant(
              root.get(ProstituteProtectionProcedure_.appointmentStart),
              criteriaBuilder,
              sortDirection);
    };
  }

  private static Expression<String> nullsLastString(
      Path<String> instantPath, CriteriaBuilder cb, SortDirection sortDirection) {
    String valueWhenNull =
        switch (sortDirection) {
          case ASC -> null;
          case DESC -> "";
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
  }

  private static Expression<Instant> nullsLastInstant(
      Path<Instant> instantPath, CriteriaBuilder cb, SortDirection sortDirection) {
    Instant valueWhenNull =
        switch (sortDirection) {
          case ASC -> Instant.parse("9999-01-01T00:00:00Z");
          case DESC -> Instant.parse("0000-01-01T00:00:00Z");
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
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
    procedureRepository.flush();
  }
}
