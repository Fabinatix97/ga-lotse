/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.util;

import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionTask;
import org.springframework.stereotype.Component;

@Component
public class TaskUtil {

  public static void closeSingleTaskOfType(ProstituteProtectionProcedure procedure, TaskType type) {
    ProstituteProtectionTask taskToUpdate = procedure.getTaskOfType(type);
    taskToUpdate.setTaskStatus(TaskStatus.CLOSED);
  }
}
