/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.rest.service.i18n.Language;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Schema(name = "ConcernConfig")
public record ConcernConfigDto(
    @NotNull @Valid Map<Language, String> names,
    @NotNull boolean highPriority,
    AppointmentTypeDto appointmentType,
    @NotNull boolean visibleInOnlinePortal) {}
