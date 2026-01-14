/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.tasks;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.repository.TaskRepository;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.model.GetTaskByUserResponse;
import de.eshg.lib.procedure.model.TaskDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.SequencedMap;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class TaskTeamOverviewService<
    TaskT extends Task<ProcedureT>, ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>> {

  private static final Comparator<UserDto> USER_BY_LASTNAME_COMPARATOR =
      Comparator.comparing(UserDto::lastName)
          .thenComparing(UserDto::firstName)
          .thenComparing(UserDto::userId);

  private final ModuleMemberGroup moduleMemberGroup;
  private final UserApi userApi;
  private final TaskRepository<TaskT> taskRepository;
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final UserHelper userHelper;

  public TaskTeamOverviewService(
      ModuleMemberGroup moduleMemberGroup,
      UserApi userApi,
      TaskRepository<TaskT> taskRepository,
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      UserHelper userHelper) {
    this.moduleMemberGroup = moduleMemberGroup;
    this.userApi = userApi;
    this.taskRepository = taskRepository;
    this.enrichingMapper = enrichingMapper;
    this.userHelper = userHelper;
  }

  public GetTaskByUserResponse getTasksByAssignee(Set<UUID> assigneeIdFilter) {
    Set<UUID> assigneeIds = getAssigneeIdsToFilterFor(assigneeIdFilter);

    List<TaskDto> taskDtos =
        enrichingMapper.enrichAndMapTasks(
            taskRepository.findAllByTaskStatusOpenAndAssigneeIdIn(assigneeIds));

    SequencedMap<UUID, List<TaskDto>> tasksByAssignee =
        taskDtos.stream()
            .collect(
                Collectors.groupingBy(
                    TaskDto::assigneeId, LinkedHashMap::new, Collectors.toList()));

    assigneeIds.forEach(userId -> tasksByAssignee.putIfAbsent(userId, Collections.emptyList()));

    Map<UUID, UserDto> resolvedUsers = userHelper.resolveUsers(tasksByAssignee, true);

    return new GetTaskByUserResponse(toSortedMap(tasksByAssignee, resolvedUsers), resolvedUsers);
  }

  private SortedMap<UUID, List<TaskDto>> toSortedMap(
      Map<UUID, List<TaskDto>> tasksByAssigneeMap, Map<UUID, UserDto> resolvedUsers) {
    SortedMap<UUID, List<TaskDto>> sortedTasksByAssigneeMap =
        new TreeMap<>(Comparator.comparing(resolvedUsers::get, USER_BY_LASTNAME_COMPARATOR));

    sortedTasksByAssigneeMap.putAll(tasksByAssigneeMap);
    return sortedTasksByAssigneeMap;
  }

  private Set<UUID> getAssigneeIdsToFilterFor(Set<UUID> assigneeId) {
    Set<UUID> groupMemberUserIds =
        userApi.getUsersByGroup(moduleMemberGroup.getKeycloakName()).users().stream()
            .map(UserDto::userId)
            .collect(StreamUtil.toLinkedHashSet());

    if (assigneeId == null) {
      return groupMemberUserIds;
    }

    if (!groupMemberUserIds.containsAll(assigneeId)) {
      throw new BadRequestException(
          ErrorCode.BAD_REQUEST, "assigneeId does not belong to module group.");
    }

    return assigneeId;
  }
}
