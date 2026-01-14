/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.statistics.support;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.function.Function;

public class ProcedureStatuses {
  private ProcedureStatuses() {}

  public static String toDescription(ProcedureStatus status) {
    return switch (status) {
      case ProcedureStatus.DRAFT -> "Entwurf";
      case ProcedureStatus.OPEN -> "Offen";
      case ProcedureStatus.IN_PROGRESS -> "In Arbeit";
      case ProcedureStatus.CLOSED -> "Geschlossen";
      case ProcedureStatus.ABORTED -> "Abgebrochen";
    };
  }

  public static Function<ProcedureStatus, ValueOptionInternal> toValueOption() {
    return status -> new ValueOptionInternal(status.name(), toDescription(status), false);
  }
}
