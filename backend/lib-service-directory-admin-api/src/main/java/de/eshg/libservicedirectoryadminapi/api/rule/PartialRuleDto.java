/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.rule;

import de.eshg.libservicedirectoryadminapi.api.staging.StagingStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.UUID;

@Schema(name = "AdminPartialRule")
public record PartialRuleDto(
    UUID id,
    String description,
    @Valid ActorSelectorDto client,
    @Valid ActorSelectorDto server,
    Boolean active,
    StagingStatusDto stagingStatus) {}
