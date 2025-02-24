/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Concern")
public record ConcernDto(
    @NotNull long version,
    @NotBlank String nameDe, // reason_de
    String nameEn,
    @NotNull boolean highPriority,
    @NotBlank String categoryNameDe,
    @NotBlank String categoryNameEn,
    AppointmentTypeDto appointmentType,
    @NotNull boolean visibleInOnlinePortal) {}
