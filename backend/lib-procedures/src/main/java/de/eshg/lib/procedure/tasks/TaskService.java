/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.tasks;

import de.eshg.lib.procedure.model.GetTasksFilterOptions;
import de.eshg.lib.procedure.model.GetTasksSortOptions;
import de.eshg.lib.procedure.model.TaskResponse;

@FunctionalInterface
public interface TaskService {

  TaskResponse getTasks( // NOSONAR
      GetTasksFilterOptions filterOptions, GetTasksSortOptions sortOptions, Integer limit);
}
