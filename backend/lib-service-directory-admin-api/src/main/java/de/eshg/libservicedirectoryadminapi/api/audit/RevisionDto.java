/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.audit;

import de.eshg.libservicedirectoryadminapi.api.actor.ActorMetadataDto;
import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

@Schema(name = "AdminRevision")
public record RevisionDto(
    @NotNull long id,
    String ip,
    String resource,
    @NotNull Instant timestamp,
    @NotNull String author,
    String committer,
    @NotNull @Valid List<Pair<PartialActorDto>> actorPairs,
    @NotNull @Valid List<Pair<ActorMetadataDto>> metadataPairs,
    @NotNull @Valid List<Pair<PartialOrgUnitDto>> orgUnitPairs,
    @NotNull @Valid List<Pair<PartialRuleDto>> rulePairs) {

  public record Pair<T>(T oldEntity, T newEntity) {}
}
