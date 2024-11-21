/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.appointmentblock.api.CreateAppointmentBlockGroupResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SchoolEntryAppointmentBlockPopulationResult(
    @NotNull @Valid List<CreateAppointmentBlockGroupResponse> appointmentBlockGroups,
    @NotNull long count) {}
