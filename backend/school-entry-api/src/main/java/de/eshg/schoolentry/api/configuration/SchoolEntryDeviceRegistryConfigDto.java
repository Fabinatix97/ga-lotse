/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "SchoolEntryDeviceRegistryConfig")
public record SchoolEntryDeviceRegistryConfigDto(
    @NotNull boolean hearingTestDeviceMeasuring,
    @NotNull boolean seeingTestDeviceMeasuring,
    @NotNull @Valid List<MeasuringDeviceDto> measuringDevices) {}
