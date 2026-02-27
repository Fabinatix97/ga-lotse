/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record GetSchoolEntryDeviceRegistryConfigResponse(
    @NotNull @Valid SchoolEntryDeviceRegistryConfigDto configuration) {}
