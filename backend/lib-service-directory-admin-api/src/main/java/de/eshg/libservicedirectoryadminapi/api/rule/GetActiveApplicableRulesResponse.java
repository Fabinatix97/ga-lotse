/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.rule;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetActiveApplicableRulesResponse(
    // rules where this actor is client (request source)
    @NotNull @Valid List<RuleDto> clientRules,

    // rules where this actor is server (request target)
    @NotNull @Valid List<RuleDto> serverRules) {}
