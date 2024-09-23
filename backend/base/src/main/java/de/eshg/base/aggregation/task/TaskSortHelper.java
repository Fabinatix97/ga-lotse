/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.task;

import de.eshg.lib.procedure.model.GetTasksSortByDto;
import de.eshg.lib.procedure.model.GetTasksSortOrderDto;
import de.eshg.lib.procedure.model.TaskDto;
import java.util.Comparator;

public final class TaskSortHelper {

  private static final Comparator<TaskDto> PRIORITY_COMPARATOR =
      Comparator.comparing(TaskDto::dueAt, Comparator.nullsLast(Comparator.naturalOrder()))
          .thenComparing(TaskDto::createdAt);
  private static final Comparator<TaskDto> MODIFIED_AT_COMPARATOR =
      Comparator.comparing(TaskDto::modifiedAt);
  private static final Comparator<TaskDto> CREATED_AT_COMPARATOR =
      Comparator.comparing(TaskDto::createdAt);

  private TaskSortHelper() {}

  public static Comparator<TaskDto> getComparator(
      GetTasksSortByDto sortBy, GetTasksSortOrderDto sortOrder) {
    Comparator<TaskDto> comparator =
        switch (sortBy) {
          case PRIORITY -> PRIORITY_COMPARATOR;
          case MODIFIED_AT -> MODIFIED_AT_COMPARATOR;
          case CREATED_AT -> CREATED_AT_COMPARATOR;
        };

    if (sortOrder == GetTasksSortOrderDto.DESC) {
      return comparator.reversed();
    }

    return comparator;
  }
}
