/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.rule;

import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetRulesResponse(
    @NotNull @Valid List<RuleDto> rules,
    @NotNull @Valid List<StagedEntityDto<PartialRuleDto>> stagedRules) {}
