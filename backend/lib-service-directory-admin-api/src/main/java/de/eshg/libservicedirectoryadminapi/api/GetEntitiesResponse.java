/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api;

import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import de.eshg.libservicedirectoryadminapi.api.rule.RuleDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetEntitiesResponse(
    @NotNull @Valid List<OrgUnitDto> orgUnits,
    @NotNull @Valid List<StagedEntityDto<PartialOrgUnitDto>> stagedOrgUnits,
    // actors are included in orgUnits
    @NotNull @Valid List<StagedEntityDto<PartialActorDto>> stagedActors,
    @NotNull @Valid List<RuleDto> rules,
    @NotNull @Valid List<StagedEntityDto<PartialRuleDto>> stagedRules) {}
