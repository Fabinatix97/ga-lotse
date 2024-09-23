/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.tasks;

import static de.eshg.domain.model.SequencedBaseEntity_.id;
import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.domain.model.Assignment_.assignedById;
import static de.eshg.lib.procedure.domain.model.Assignment_.assigneeId;
import static de.eshg.lib.procedure.domain.model.Task_.createdAt;
import static de.eshg.lib.procedure.domain.model.Task_.currentAssignment;
import static de.eshg.lib.procedure.domain.model.Task_.dueAt;
import static de.eshg.lib.procedure.domain.model.Task_.modifiedAt;
import static de.eshg.lib.procedure.domain.model.Task_.taskStatus;
import static de.eshg.lib.procedure.domain.model.Task_.taskType;
import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.repository.TaskRepository;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.mapping.TaskMapper;
import de.eshg.lib.procedure.model.GetTasksFilterOptions;
import de.eshg.lib.procedure.model.GetTasksSortByDto;
import de.eshg.lib.procedure.model.GetTasksSortOptions;
import de.eshg.lib.procedure.model.GetTasksSortOrderDto;
import de.eshg.lib.procedure.model.TaskDto;
import de.eshg.lib.procedure.model.TaskResponse;
import de.eshg.lib.procedure.model.TaskStatusDto;
import de.eshg.lib.procedure.model.TaskTypeDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Stream;
import org.hibernate.Session;
import org.hibernate.query.NullPrecedence;
import org.hibernate.query.criteria.HibernateCriteriaBuilder;
import org.hibernate.query.criteria.JpaOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl<
        TaskT extends de.eshg.lib.procedure.domain.model.Task<ProcedureT>,
        ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>>
    implements TaskService {

  private final TaskRepository<TaskT> taskRepository;
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final Clock clock;
  private final EntityManager entityManager;

  public TaskServiceImpl(
      TaskRepository<TaskT> taskRepository,
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      Clock clock,
      EntityManager entityManager) {
    this.taskRepository = taskRepository;
    this.enrichingMapper = enrichingMapper;
    this.clock = clock;
    this.entityManager = entityManager;
  }

  @Override
  public TaskResponse getTasks(
      GetTasksFilterOptions filterOptions, GetTasksSortOptions sortOptions, Integer limit) {

    Page<TaskT> page =
        taskRepository.findAll(
            Specification.where(assigneeId(filterOptions.assigneeId()))
                .and(assignedById(filterOptions.assignedById()))
                .and(taskTypes(filterOptions.taskTypes()))
                .and(taskStatuses(filterOptions.taskStatus()))
                .and(hasDueAt(filterOptions.hasDueAt()))
                .and(isOverdue(filterOptions.isOverdue()))
                .and(wasAssignedByOther(filterOptions.wasAssignedByOther()))
                .and(sort(sortOptions.sortKey(), sortOptions.sortOrder())),
            PageRequest.ofSize(limit));

    List<TaskDto> tasks = page.stream().map(enrichingMapper::enrichAndMap).toList();

    return new TaskResponse(page.getTotalElements(), tasks);
  }

  private Specification<TaskT> assigneeId(UUID filteringAssigneeId) {
    if (filteringAssigneeId != null) {
      return (root, query, cb) ->
          cb.equal(root.get(currentAssignment).get(assigneeId), filteringAssigneeId);
    }
    return null;
  }

  private Specification<TaskT> assignedById(Set<UUID> filteringAssignedById) {
    if (filteringAssignedById != null) {
      return (root, query, cb) ->
          root.get(currentAssignment).get(assignedById).in(filteringAssignedById);
    }
    return null;
  }

  private Specification<TaskT> taskTypes(Set<TaskTypeDto> taskTypes) {
    if (taskTypes != null && !taskTypes.isEmpty()) {
      Set<de.eshg.lib.procedure.domain.model.TaskType> types =
          mapEnumSet(taskTypes, TaskMapper::toDomainType);
      return (root, query, cb) -> root.get(taskType).in(types);
    }
    return null;
  }

  private Specification<TaskT> taskStatuses(Set<TaskStatusDto> taskStatuses) {
    if (taskStatuses != null && !taskStatuses.isEmpty()) {
      Set<de.eshg.lib.procedure.domain.model.TaskStatus> statuses =
          mapEnumSet(taskStatuses, TaskMapper::toDomainType);
      return (root, query, cb) -> root.get(taskStatus).in(statuses);
    }
    return null;
  }

  private Specification<TaskT> hasDueAt(Boolean hasDueAt) {
    if (TRUE.equals(hasDueAt)) {
      return (root, query, cb) -> cb.isNotNull(root.get(dueAt));
    }

    if (FALSE.equals(hasDueAt)) {
      return (root, query, cb) -> cb.isNull(root.get(dueAt));
    }
    return null;
  }

  private Specification<TaskT> isOverdue(Boolean isOverdue) {
    if (TRUE.equals(isOverdue)) {
      return (root, query, cb) -> isOverdueTrueExpression(root, cb);
    }

    if (FALSE.equals(isOverdue)) {
      return (root, query, cb) -> cb.not(isOverdueTrueExpression(root, cb));
    }

    return null;
  }

  private Predicate isOverdueTrueExpression(Root<TaskT> root, CriteriaBuilder cb) {
    return cb.and(
        cb.lessThanOrEqualTo(root.get(dueAt), Instant.now(clock)),
        cb.notEqual(root.get(taskStatus), TaskStatus.CLOSED));
  }

  private Specification<TaskT> wasAssignedByOther(Boolean wasAssignedByOther) {
    if (TRUE.equals(wasAssignedByOther)) {
      return (root, query, cb) ->
          cb.notEqual(
              root.get(currentAssignment).get(assignedById),
              root.get(currentAssignment).get(assigneeId));
    }

    if (FALSE.equals(wasAssignedByOther)) {
      return (root, query, cb) ->
          cb.or(
              cb.isNull(root.get(currentAssignment).get(assignedById)),
              cb.equal(
                  root.get(currentAssignment).get(assignedById),
                  root.get(currentAssignment).get(assigneeId)));
    }
    return null;
  }

  private Specification<TaskT> sort(GetTasksSortByDto sortBy, GetTasksSortOrderDto sortOrder) {
    return (root, query, cb) -> {
      List<Order> order = getSortOrder(sortBy, sortOrder, root);
      query.orderBy(order);
      return null;
    };
  }

  // use HibernateCriteriaBuilder because spring-data-jpa sorting is broken
  // https://github.com/spring-projects/spring-data-jpa/issues/1280
  private List<Order> getSortOrder(
      GetTasksSortByDto sortBy, GetTasksSortOrderDto sortOrder, Root<TaskT> root) {
    HibernateCriteriaBuilder hibernateCriteriaBuilder =
        entityManager.unwrap(Session.class).getCriteriaBuilder();

    Function<Expression<?>, JpaOrder> jpaOrder =
        sortOrder == GetTasksSortOrderDto.ASC
            ? hibernateCriteriaBuilder::asc
            : hibernateCriteriaBuilder::desc;

    NullPrecedence nullPrecedence =
        sortOrder == GetTasksSortOrderDto.ASC ? NullPrecedence.LAST : NullPrecedence.FIRST;

    List<Order> orders =
        switch (sortBy) {
          case PRIORITY -> byPriority(root, jpaOrder, nullPrecedence);
          case MODIFIED_AT -> byModifiedAt(root, jpaOrder);
          case CREATED_AT -> byCreatedAt(root, jpaOrder);
        };

    return Stream.concat(orders.stream(), Stream.of(hibernateCriteriaBuilder.asc(root.get(id))))
        .toList();
  }

  private List<Order> byPriority(
      Root<TaskT> root,
      Function<Expression<?>, JpaOrder> jpaOrderFunction,
      NullPrecedence nullPrecedence) {
    return List.of(
        jpaOrderFunction.apply(root.get(dueAt)).nullPrecedence(nullPrecedence),
        jpaOrderFunction.apply(root.get(createdAt)));
  }

  private List<Order> byCreatedAt(
      Root<TaskT> root, Function<Expression<?>, JpaOrder> jpaOrderFunction) {
    return List.of(jpaOrderFunction.apply(root.get(createdAt)));
  }

  private List<Order> byModifiedAt(
      Root<TaskT> root, Function<Expression<?>, JpaOrder> jpaOrderFunction) {
    return List.of(jpaOrderFunction.apply(root.get(modifiedAt)));
  }
}
