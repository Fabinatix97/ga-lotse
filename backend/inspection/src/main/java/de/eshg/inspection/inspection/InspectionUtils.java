/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;

public class InspectionUtils {

  public static void checkInspectionIsNotClosed(
      Inspection inspection, String clientVisibleMessage, String errorMessageAppendix) {
    if (ProcedureStatus.isClosed(inspection.getProcedureStatus())) {
      throw new BadRequestException(
          clientVisibleMessage,
          "Inspection %s procedure is %s, %s"
              .formatted(
                  inspection.getExternalId(),
                  inspection.getProcedureStatus().name(),
                  errorMessageAppendix));
    }
  }
}
