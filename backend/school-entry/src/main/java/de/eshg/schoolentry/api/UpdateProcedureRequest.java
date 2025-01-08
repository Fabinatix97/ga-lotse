/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record UpdateProcedureRequest(
    @NotNull long version,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull List<UUID> labels,
    @Valid AppointmentDto appointment,
    @NotNull boolean isInvitationSent,
    UUID schoolId,
    UUID locationId,
    @NotNull boolean isDeceased,
    LocalDate deceased,
    @Min(1900) Integer schoolYear) {}
