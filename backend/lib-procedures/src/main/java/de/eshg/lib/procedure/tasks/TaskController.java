/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.tasks;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.base.user.UserApi;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.api.TaskApi;
import de.eshg.lib.procedure.api.TaskMetricsApi;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.domain.repository.TaskRepository;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.mapping.TaskMapper;
import de.eshg.lib.procedure.model.AssignTaskRequest;
import de.eshg.lib.procedure.model.GetTaskByUserResponse;
import de.eshg.lib.procedure.model.GetTaskMetricsResponse;
import de.eshg.lib.procedure.model.GetTasksFilterOptions;
import de.eshg.lib.procedure.model.GetTasksSortOptions;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.lib.procedure.model.ProcedureWithDuration;
import de.eshg.lib.procedure.model.SelfAssignTaskRequest;
import de.eshg.lib.procedure.model.TaskDto;
import de.eshg.lib.procedure.model.TaskMetric;
import de.eshg.lib.procedure.model.TaskResponse;
import de.eshg.lib.procedure.util.MetricTimeRangeValidator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

@RestController
@Tag(name = "Task")
public class TaskController<
        TaskT extends Task<ProcedureT>, ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>>
    implements TaskApi, TaskMetricsApi {

  private final TaskService taskService;
  private final TaskRepository<TaskT> taskRepository;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final TaskTeamOverviewService<TaskT, ProcedureT> taskTeamOverviewService;
  private final BusinessModule businessModule;
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final UserApi userApi;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final Clock clock;

  public TaskController(
      TaskService taskService,
      TaskRepository<TaskT> taskRepository,
      ProcedureRepository<ProcedureT> procedureRepository,
      TaskTeamOverviewService<TaskT, ProcedureT> taskTeamOverviewService,
      BusinessModule businessModule,
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      UserApi userApi,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      Clock clock) {
    this.taskService = taskService;
    this.taskRepository = taskRepository;
    this.procedureRepository = procedureRepository;
    this.taskTeamOverviewService = taskTeamOverviewService;
    this.businessModule = businessModule;
    this.enrichingMapper = enrichingMapper;
    this.userApi = userApi;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.clock = clock;
  }

  @Override
  @Transactional(readOnly = true)
  public TaskResponse getTasksForDashboard() {
    return taskService.getTasks(
        GetTasksFilterOptions.forDashboard(CurrentUserHelper.getCurrentUserId()),
        GetTasksSortOptions.fromSortBy(DASHBOARD_SORT_BY),
        DASHBOARD_LIMIT);
  }

  @Override
  @Transactional(readOnly = true)
  public TaskResponse getTasks(
      GetTasksFilterOptions filterOptions, GetTasksSortOptions sortOptions, Integer limit) {
    validateEitherTaskOrAssignedByIsGiven(filterOptions);
    return taskService.getTasks(filterOptions, sortOptions, limit);
  }

  private void validateEitherTaskOrAssignedByIsGiven(GetTasksFilterOptions filterOptions) {
    if (!eitherAssigneeIdOrAssignedByIdAreGiven(
        filterOptions.assigneeId(), filterOptions.assignedById())) {
      throw new BadRequestException("One of 'assigneeId' and 'assignedById' must be given.");
    }
  }

  private static boolean eitherAssigneeIdOrAssignedByIdAreGiven(
      UUID assigneeId, Set<UUID> assignedBy) {
    return (assignedBy != null && !assignedBy.isEmpty()) || assigneeId != null;
  }

  @Transactional
  @Override
  public TaskDto assignTask(UUID taskId, AssignTaskRequest assignTaskRequest) {
    UUID assigneeId = assignTaskRequest.assignee();
    validateUserExists(assigneeId);
    return assignTask(taskId, assigneeId, assignTaskRequest.dueAt());
  }

  @Transactional
  @Override
  public TaskDto selfAssignTask(UUID taskId, SelfAssignTaskRequest assignTaskRequest) {
    return assignTask(taskId, CurrentUserHelper.getCurrentUserId(), assignTaskRequest.dueAt());
  }

  @Override
  @Transactional(readOnly = true)
  public GetTaskByUserResponse getTasksByAssignee(Set<UUID> assignee) {
    return taskTeamOverviewService.getTasksByAssignee(assignee);
  }

  private TaskDto assignTask(UUID taskId, UUID assigneeId, Instant dueAt) {
    TaskT task = getTaskOrThrow(taskId);
    task.assign(assigneeId, CurrentUserHelper.getCurrentUserId(), Instant.now(clock));
    task.updateDueAt(dueAt);
    taskRepository.flush();
    return enrichingMapper.enrichAndMap(task);
  }

  private TaskT getTaskOrThrow(UUID taskId) {
    return taskRepository
        .findByExternalId(taskId)
        .orElseThrow(() -> new NotFoundException("Task not found"));
  }

  private void validateUserExists(UUID userId) {
    try {
      userApi.getUser(userId);
    } catch (HttpClientErrorException.NotFound notFound) {
      throw new NotFoundException("User not found");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public GetTaskMetricsResponse getTaskMetrics(
      ProcedureTypeDto procedureTypeDto, Instant timeRangeStart, Instant timeRangeEnd) {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.TASK_METRICS)) {
      throw new BadRequestException(
          "New feature %s is not enabled".formatted(BaseFeature.TASK_METRICS));
    }

    MetricTimeRangeValidator.validateTimeRange(timeRangeStart, timeRangeEnd);

    ProcedureType procedureType = ProcedureMapper.toDomainType(procedureTypeDto);
    Set<TaskType> taskTypes = taskRepository.findDistinctTaskTypesForProcedureType(procedureType);

    List<TaskMetric> taskMetrics =
        taskTypes.stream()
            .sorted(Comparator.comparing(TaskType::name))
            .map(taskType -> getTaskMetric(procedureType, taskType, timeRangeStart, timeRangeEnd))
            .toList();

    Long closedProcedures =
        procedureRepository.countClosedProcedures(procedureType, timeRangeStart, timeRangeEnd);

    List<ProcedureWithDuration> fastestProcedures =
        mapToProcedureWithDurationList(
            procedureRepository.findClosedProceduresSortedByDurationsAsc(
                procedureType, timeRangeStart, timeRangeEnd, 5));
    List<ProcedureWithDuration> slowestProcedures =
        mapToProcedureWithDurationList(
            procedureRepository.findClosedProceduresSortedByDurationsDesc(
                procedureType, timeRangeStart, timeRangeEnd, 5));

    return new GetTaskMetricsResponse(
        businessModule,
        procedureTypeDto,
        closedProcedures,
        taskMetrics,
        fastestProcedures,
        slowestProcedures);
  }

  private List<ProcedureWithDuration> mapToProcedureWithDurationList(List<ProcedureT> procedures) {
    return procedures.stream()
        .map(
            procedure ->
                new ProcedureWithDuration(
                    procedure.getExternalId(),
                    procedure.getCreatedAt(),
                    Duration.between(procedure.getCreatedAt(), procedure.getClosedAt()).toString()))
        .toList();
  }

  private TaskMetric getTaskMetric(
      ProcedureType procedureType,
      TaskType taskType,
      Instant timeRangeStart,
      Instant timeRangeEnd) {

    int proceduresWithoutTasksCount =
        (int)
            procedureRepository.countClosedProceduresWithoutTaskType(
                procedureType, taskType, timeRangeStart, timeRangeEnd);

    Map<Long, Long> taskTypeCounts =
        taskRepository
            .countTaskTypeForClosedProcedures(procedureType, taskType, timeRangeStart, timeRangeEnd)
            .collect(
                StreamUtil.toLinkedHashMap(
                    TaskRepository.TaskTypeCount::getOccurrence,
                    TaskRepository.TaskTypeCount::getFrequency));
    AtomicInteger noOccurrences = new AtomicInteger(proceduresWithoutTasksCount);
    AtomicInteger oneOccurrence = new AtomicInteger(0);
    AtomicInteger twoOccurrences = new AtomicInteger(0);
    AtomicInteger moreThanTwoOccurrences = new AtomicInteger(0);
    taskTypeCounts.forEach(
        (entryKey, entryValue) -> {
          switch (entryKey.intValue()) {
            case 0 -> noOccurrences.addAndGet(1);
            case 1 -> oneOccurrence.addAndGet(1);
            case 2 -> twoOccurrences.addAndGet(1);
            default -> moreThanTwoOccurrences.addAndGet(1);
          }
        });

    String averageDuration =
        getAverageDuration(procedureType, taskType, timeRangeStart, timeRangeEnd);

    return new TaskMetric(
        TaskMapper.toInterfaceType(taskType),
        noOccurrences.get(),
        oneOccurrence.get(),
        twoOccurrences.get(),
        moreThanTwoOccurrences.get(),
        averageDuration);
  }

  private String getAverageDuration(
      ProcedureType procedureType,
      TaskType taskType,
      Instant timeRangeStart,
      Instant timeRangeEnd) {
    List<Duration> durations =
        taskRepository.findTaskDurations(procedureType, taskType, timeRangeStart, timeRangeEnd);
    if (durations.isEmpty()) {
      return null;
    }

    return Duration.ofMinutes(
            Math.round(durations.stream().mapToLong(Duration::toMinutes).average().orElseThrow()))
        .toString();
  }
}
