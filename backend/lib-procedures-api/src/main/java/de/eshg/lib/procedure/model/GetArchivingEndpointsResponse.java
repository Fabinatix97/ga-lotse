/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record GetArchivingEndpointsResponse(
    @CanBeLogged @Valid @NotNull Map<String, String> endpoints,
    @CanBeLogged String defaultEndpointId) {}
