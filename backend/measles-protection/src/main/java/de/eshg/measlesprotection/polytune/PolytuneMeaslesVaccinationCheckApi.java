/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.polytune;

import java.util.UUID;

public interface PolytuneMeaslesVaccinationCheckApi {
  void schedule(PolytuneScheduleMeaslesVaccinationCheckRequest request);

  PolytuneMeaslesVaccinationCheckResponse getResult(UUID requestId);
}
