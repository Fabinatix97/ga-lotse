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

@Schema(name = "CitizenProcedure")
public record GetCitizenProcedureResponse(
    @NotNull ConcernDto concern,
    @NotNull @Valid PersonDto person,
    @Valid AppointmentDto appointment,
    @NotNull @Valid List<AppointmentHistoryEntryDto> appointmentHistory) {}
