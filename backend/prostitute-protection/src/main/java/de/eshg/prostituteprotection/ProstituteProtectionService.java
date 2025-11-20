/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.SortDirection;
import de.eshg.domain.model.SequencedBaseEntity_;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment_;
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
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure_;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionTask;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper;
import de.eshg.rest.service.security.CurrentUserHelper;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class ProstituteProtectionService {

  private final ProstituteProtectionProcedureRepository procedureRepository;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public ProstituteProtectionService(
      ProstituteProtectionProcedureRepository procedureRepository,
      Clock clock,
      AuditLogger auditLogger) {
    this.procedureRepository = procedureRepository;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  CreateProstituteProtectionProcedureResponse createProstituteProtectionProcedure(
      CreateProstituteProtectionProcedureRequest createProstituteProtectionProcedureRequest) {
    ProstituteProtectionProcedure prostituteProtectionProcedure =
        ProstituteProtectionMapper.mapRequestToDomain(createProstituteProtectionProcedureRequest);
    prostituteProtectionProcedure.setProcedureType(ProcedureType.PROSTITUTE_PROTECTION);
    prostituteProtectionProcedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    prostituteProtectionProcedure.addTask(createTask());
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
              root.get(ProstituteProtectionProcedure_.ALIAS), criteriaBuilder, sortDirection);
      case APPOINTMENT_START ->
          nullsLastInstant(
              root.join(ProstituteProtectionProcedure_.APPOINTMENT, JoinType.LEFT)
                  .get(Appointment_.APPOINTMENT_START),
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
}
