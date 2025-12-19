/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.Valid;

public record GetProstituteProtectionAppointmentStandardDurationsResponse(
    @Valid ProstituteProtectionAppointmentStandardDurationsDto standardDurations) {}
