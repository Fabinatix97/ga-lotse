/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;

@Schema(name = "PostTopologyRequest")
public record PostTopologyRequestDto(@Valid List<ActorRequestDto> actorsRequest) {}
