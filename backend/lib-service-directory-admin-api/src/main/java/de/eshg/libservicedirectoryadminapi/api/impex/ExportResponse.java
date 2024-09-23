/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.impex;

import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.RuleDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ExportResponse(
    @NotNull @Valid List<OrgUnitDto> orgUnits, @NotNull @Valid List<RuleDto> rules) {}
