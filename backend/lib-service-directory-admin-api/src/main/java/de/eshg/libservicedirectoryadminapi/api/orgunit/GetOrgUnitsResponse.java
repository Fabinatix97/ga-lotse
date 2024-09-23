/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.orgunit;

import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetOrgUnitsResponse(
    @NotNull @Valid List<OrgUnitDto> orgUnits,
    @NotNull @Valid List<StagedEntityDto<PartialOrgUnitDto>> stagedOrgUnits,
    @NotNull @Valid List<StagedEntityDto<PartialActorDto>> stagedActors) {}
