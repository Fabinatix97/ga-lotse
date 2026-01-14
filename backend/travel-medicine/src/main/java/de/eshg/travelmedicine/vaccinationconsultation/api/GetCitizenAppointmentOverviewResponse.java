/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetCitizenAppointmentOverviewResponse(
    @NotNull UUID procedureId,
    @NotNull @Valid List<AppointmentSummaryDto> openAppointments,
    @NotNull @Valid List<AppointmentSummaryDto> closedAppointments) {}
