/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.staging;

import de.eshg.libservicedirectoryadminapi.api.actor.ActorDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.RuleDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Schema(name = "AdminCommitResponse")
public record CommitResponseDto(
    @Valid Map<UUID, ActorDto> actors,
    List<UUID> deletedActors,
    @Valid Map<UUID, OrgUnitDto> orgUnits,
    List<UUID> deletedOrgUnits,
    @Valid Map<UUID, RuleDto> rules,
    List<UUID> deletedRules) {}
