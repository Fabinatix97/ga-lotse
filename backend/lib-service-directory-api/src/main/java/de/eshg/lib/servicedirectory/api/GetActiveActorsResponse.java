/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory.api;

import jakarta.validation.Valid;
import java.util.List;

public record GetActiveActorsResponse(@Valid List<ActorResponseDto> actors) {}
