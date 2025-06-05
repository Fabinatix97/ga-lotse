/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.configuration;

import jakarta.validation.Valid;

public record GetSchoolEntryAppointmentStandardDurationsResponse(
    @Valid SchoolEntryAppointmentStandardDurationsDto standardDurations) {}
