/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record GetArchivingEndpointsResponse(
    @Valid @NotNull Map<String, String> endpoints, String defaultEndpointId) {}
