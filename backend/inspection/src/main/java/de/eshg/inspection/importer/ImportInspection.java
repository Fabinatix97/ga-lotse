/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static java.time.temporal.ChronoUnit.DAYS;

import de.eshg.inspection.inspection.api.InspectionResult;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

record ImportInspection(Instant lastInspected, @NotNull InspectionResult result, String incidents) {

  boolean hasInvalidLastInspectedDate() {
    return lastInspected == null;
  }

  boolean isSameDayAndResultAs(@NotNull ImportInspection other) {
    return isSameDay(other) && result.equals(other.result);
  }

  boolean isSameDayDifferentResultAs(@NotNull ImportInspection other) {
    return isSameDay(other) && !result.equals(other.result);
  }

  private boolean isSameDay(ImportInspection other) {
    return lastInspected.truncatedTo(DAYS).equals(other.lastInspected.truncatedTo(DAYS));
  }
}
