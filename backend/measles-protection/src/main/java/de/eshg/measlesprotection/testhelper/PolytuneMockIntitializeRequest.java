/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckResult;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

public record PolytuneMockIntitializeRequest(
    @Valid Map<UUID, PolytuneMeaslesVaccinationCheckResult> results, Duration calculationTime) {
  public static PolytuneMockIntitializeRequest of(
      UUID fileStateId, PolytuneMeaslesVaccinationCheckResult result, Duration calculationTime) {
    return new PolytuneMockIntitializeRequest(Map.of(fileStateId, result), calculationTime);
  }

  public static PolytuneMockIntitializeRequest of(
      UUID fileStateId, PolytuneMeaslesVaccinationCheckResult result) {
    return of(fileStateId, result, Duration.ZERO);
  }

  public static PolytuneMockIntitializeRequest empty() {
    return new PolytuneMockIntitializeRequest(Collections.emptyMap(), Duration.ZERO);
  }
}
