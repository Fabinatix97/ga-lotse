/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "SchoolEntryMeasuringDevice")
public record MeasuringDeviceDto(
    @NotNull UUID externalId,
    @NotNull long version,
    @NotNull MeasuringDeviceTypeDto deviceType,
    @NotBlank String name,
    @NotBlank String equipmentSelector,
    @NotNull GdtDriverDto gdtDriver) {}
