/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import jakarta.validation.Valid;

public record GetInfectionBriefingAppointmentStandardDurationsResponse(
    @Valid InfectionBriefingAppointmentStandardDurationsDto standardDurations) {}
