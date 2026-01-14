/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import jakarta.validation.Valid;

public record GetHivStiConsultationAppointmentStandardDurationsResponse(
    @Valid HivStiConsultationAppointmentStandardDurationsDto standardDurations) {}
