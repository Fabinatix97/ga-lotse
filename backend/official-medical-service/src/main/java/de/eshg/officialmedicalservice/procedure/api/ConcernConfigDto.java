/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ConcernConfig")
public record ConcernConfigDto(
    @NotBlank String nameDe, // reason_de
    String nameEn,
    @NotNull boolean highPriority,
    AppointmentTypeDto appointmentType,
    @NotNull boolean visibleInOnlinePortal) {}
