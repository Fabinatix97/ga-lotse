/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import static de.eshg.lib.procedure.model.TaskTypeDto.BOOK_APPOINTMENT;
import static de.eshg.lib.procedure.model.TaskTypeDto.INSPECTION_EXECUTION;
import static de.eshg.lib.procedure.model.TaskTypeDto.INSPECTION_PLANNING;
import static de.eshg.lib.procedure.model.TaskTypeDto.INSPECTION_REPORT;
import static de.eshg.lib.procedure.model.TaskTypeDto.MEASLES_PROTECTION;
import static de.eshg.lib.procedure.model.TaskTypeDto.PERFORM_SCHOOL_ENTRY_EXAMINATION;
import static de.eshg.lib.procedure.model.TaskTypeDto.STI_PROTECTION;
import static de.eshg.lib.procedure.model.TaskTypeDto.TRAVEL_MEDICINE;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.model.TaskDto;
import de.eshg.lib.procedure.model.TaskStatusDto;
import de.eshg.lib.procedure.model.TaskTypeDto;

public final class TaskMapper {

  private TaskMapper() {}

  public static TaskDto toInterfaceType(
      Task<?> domainModelTask, BusinessModule businessModule, String summary, boolean isOverdue) {

    return new TaskDto(
        domainModelTask.getProcedure().getExternalId(),
        businessModule,
        domainModelTask.getExternalId(),
        domainModelTask.getVersion(),
        domainModelTask.getCreatedAt(),
        domainModelTask.getModifiedAt(),
        domainModelTask.getDueAt(),
        isOverdue,
        summary,
        domainModelTask.getAssigneeId(),
        domainModelTask.getAssignedById(),
        toInterfaceType(domainModelTask.getTaskStatus()),
        toInterfaceType(domainModelTask.getTaskType()));
  }

  private static TaskStatusDto toInterfaceType(TaskStatus taskStatus) {
    return switch (taskStatus) {
      case OPEN -> TaskStatusDto.OPEN;
      case CLOSED -> TaskStatusDto.CLOSED;
    };
  }

  public static TaskTypeDto toInterfaceType(TaskType taskType) {
    return switch (taskType) {
      case BOOK_APPOINTMENT -> BOOK_APPOINTMENT;
      case PERFORM_SCHOOL_ENTRY_EXAMINATION -> PERFORM_SCHOOL_ENTRY_EXAMINATION;
      case INSPECTION_PLANNING -> INSPECTION_PLANNING;
      case INSPECTION_EXECUTION -> INSPECTION_EXECUTION;
      case INSPECTION_REPORT -> INSPECTION_REPORT;
      case TRAVEL_MEDICINE -> TRAVEL_MEDICINE;
      case MEASLES_PROTECTION -> MEASLES_PROTECTION;
      case STI_PROTECTION -> STI_PROTECTION;
    };
  }

  public static TaskType toDomainType(TaskTypeDto taskType) {
    return switch (taskType) {
      case BOOK_APPOINTMENT -> TaskType.BOOK_APPOINTMENT;
      case PERFORM_SCHOOL_ENTRY_EXAMINATION -> TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION;
      case INSPECTION_PLANNING -> TaskType.INSPECTION_PLANNING;
      case INSPECTION_EXECUTION -> TaskType.INSPECTION_EXECUTION;
      case INSPECTION_REPORT -> TaskType.INSPECTION_REPORT;
      case TRAVEL_MEDICINE -> TaskType.TRAVEL_MEDICINE;
      case MEASLES_PROTECTION -> TaskType.MEASLES_PROTECTION;
      case STI_PROTECTION -> TaskType.STI_PROTECTION;
    };
  }

  public static TaskStatus toDomainType(TaskStatusDto taskStatus) {
    return switch (taskStatus) {
      case OPEN -> TaskStatus.OPEN;
      case CLOSED -> TaskStatus.CLOSED;
    };
  }
}
