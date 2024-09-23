/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record GetArchivingConfigurationResponse(
    @CanBeLogged @NotNull int gracePeriodMonths,
    @CanBeLogged @NotEmpty @Valid Map<ProcedureTypeDto, ArchivingDetailsDto> archivingDetails) {}
