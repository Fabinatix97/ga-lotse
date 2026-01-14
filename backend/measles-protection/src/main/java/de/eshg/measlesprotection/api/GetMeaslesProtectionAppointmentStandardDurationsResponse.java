/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import jakarta.validation.Valid;

public record GetMeaslesProtectionAppointmentStandardDurationsResponse(
    @Valid MeaslesProtectionAppointmentStandardDurationsDto standardDurations) {}
