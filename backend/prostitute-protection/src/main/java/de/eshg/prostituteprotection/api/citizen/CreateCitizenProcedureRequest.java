/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api.citizen;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.prostituteprotection.api.LanguageDto;
import de.eshg.prostituteprotection.api.ProcedureTypeDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreateCitizenProcedureRequest(
    @NotNull String alias,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull @NotEmpty List<LanguageDto> languages,
    @NotNull @Valid AppointmentDto appointment) {}
