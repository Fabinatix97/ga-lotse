/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.appointmentblock.api.CreateAppointmentBlockGroupResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SchoolEntryAppointmentBlockPopulationResult(
    @NotNull @Valid List<CreateAppointmentBlockGroupResponse> appointmentBlockGroups,
    @NotNull long count) {}
