/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record GetTrustedActorsResponse(
    @Valid @NotNull Set<ActorResponseDto> trustedInboundActors,
    @Valid @NotNull Set<ActorResponseDto> trustedOutboundActors) {}
