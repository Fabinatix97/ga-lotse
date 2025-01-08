/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.actor;

import jakarta.validation.Valid;
import java.util.List;

public record GetApplicableActorsResponse(@Valid List<ActorDto> actors) {}
