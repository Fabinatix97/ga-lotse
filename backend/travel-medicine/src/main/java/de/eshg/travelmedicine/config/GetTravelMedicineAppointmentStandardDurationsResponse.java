/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.config;

import jakarta.validation.Valid;

public record GetTravelMedicineAppointmentStandardDurationsResponse(
    @Valid TravelMedicineAppointmentStandardDurationsDto standardDurations) {}
