/*
 * Copyright 2025 cronn GmbH
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

import de.eshg.lib.procedure.domain.model.Procedure;
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
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Root;
import java.util.List;
import java.util.Set;
import java.util.UUID;
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
public class TaskService<
    TaskT extends de.eshg.lib.procedure.domain.model.Task<ProcedureT>,
    ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>> {

  private final TaskRepository<TaskT> taskRepository;
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final EntityManager entityManager;

  public TaskService(
      TaskRepository<TaskT> taskRepository,
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      EntityManager entityManager) {
    this.taskRepository = taskRepository;
    this.enrichingMapper = enrichingMapper;
    this.entityManager = entityManager;
  }

  public TaskResponse getTasks(
      GetTasksFilterOptions filterOptions, GetTasksSortOptions sortOptions, Integer limit) {

    Page<TaskT> page =
        taskRepository.findAll(
            Specification.allOf(
                assigneeId(filterOptions.assigneeId()),
                assignedById(filterOptions.assignedById()),
                taskTypes(filterOptions.taskTypes()),
                taskStatuses(filterOptions.taskStatus()),
                sort(sortOptions.sortKey(), sortOptions.sortOrder())),
            PageRequest.ofSize(limit));

    List<TaskDto> enrichedTasks = enrichingMapper.enrichAndMapTasks(page.stream().toList());
    return new TaskResponse(page.getTotalElements(), enrichedTasks);
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
