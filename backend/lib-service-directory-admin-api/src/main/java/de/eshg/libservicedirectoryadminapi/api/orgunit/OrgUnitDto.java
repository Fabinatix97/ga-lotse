/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.orgunit;

import de.eshg.lib.common.FederalState;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "AdminOrgUnit")
public record OrgUnitDto(
    @NotNull UUID id,
    @NotNull String readableName,
    @NotNull boolean active,
    @NotNull OrgUnitTypeDto type,
    @NotNull FederalState federalState,
    @NotNull @Valid List<ActorDto> actors) {}
