/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.polytune;

import jakarta.validation.Valid;

public record PolytuneMeaslesVaccinationCheckResponse(
    PolytuneMeaslesVaccinationCheckStatus status,
    @Valid PolytuneMeaslesVaccinationCheckResult result) {}
