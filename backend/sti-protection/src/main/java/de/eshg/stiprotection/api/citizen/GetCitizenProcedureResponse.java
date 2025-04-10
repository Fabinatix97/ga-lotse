/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.stiprotection.api.AppointmentHistoryEntryDto;
import de.eshg.stiprotection.api.ConcernDto;
import de.eshg.stiprotection.api.PersonDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "CitizenProcedure")
public record GetCitizenProcedureResponse(
    @Schema(description = "An unique identifier for the STI protection procedure.") @NotNull
        UUID id,
    @NotNull ConcernDto concern,
    @NotNull @Valid PersonDto person,
    @Valid AppointmentDto appointment,
    @NotNull @Valid List<AppointmentHistoryEntryDto> appointmentHistory,
    @Schema(description = "Indicates whether the medical history has been submitted.") @NotNull
        Boolean medicalHistorySubmitted) {}
