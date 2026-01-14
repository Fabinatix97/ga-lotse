/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.testhelper;

import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrgUnitPopulationResponse(@Valid @NotNull List<OrgUnitDto> populations) {}
