/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskType;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskTypeDto;

public class GdprValidationTaskMapper {

  private GdprValidationTaskMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static GdprValidationTask mapGdprValidationTaskToDm(AddGdprValidationTaskRequest request) {
    GdprValidationTask task = new GdprValidationTask();
    task.setProcedureId(request.procedureId());
    task.setType(mapToDm(request.type()));
    task.setStatus(GdprValidationTaskStatus.OPEN);
    return task;
  }

  public static GdprValidationTaskType mapToDm(GdprValidationTaskTypeDto type) {
    return switch (type) {
      case null -> null;
      case RIGHT_OF_ACCESS -> GdprValidationTaskType.RIGHT_OF_ACCESS;
      case RIGHT_TO_ERASURE -> GdprValidationTaskType.RIGHT_TO_ERASURE;
    };
  }
}
