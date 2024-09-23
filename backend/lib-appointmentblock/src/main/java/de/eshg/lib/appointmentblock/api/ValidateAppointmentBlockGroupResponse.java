/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record ValidateAppointmentBlockGroupResponse(
    @NotNull List<UUID> userIdsWithEventConflicts,
    @NotNull List<UUID> userIdsWithoutEventConflicts) {}
