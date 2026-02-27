/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddSchoolEntryMeasurementDeviceRequest(
    @NotNull MeasuringDeviceTypeDto deviceType,
    @NotBlank String name,
    @NotBlank String equipmentSelector,
    @NotNull GdtDriverDto gdtDriver) {}
