/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import jakarta.validation.Valid;

public record GetMedsAbroadAppointmentStandardDurationsResponse(
    @Valid MedsAbroadAppointmentStandardDurationsDto standardDurations) {}
