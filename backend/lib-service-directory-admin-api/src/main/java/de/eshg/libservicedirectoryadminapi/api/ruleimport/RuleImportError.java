/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.ruleimport;

import de.eshg.libservicedirectoryadminapi.api.rule.ActorSelectorDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AdminRuleImportError")
public record RuleImportError(
    @NotNull int index,
    UUID id,
    @Valid ActorSelectorDto client,
    @Valid ActorSelectorDto server,
    String message) {}
