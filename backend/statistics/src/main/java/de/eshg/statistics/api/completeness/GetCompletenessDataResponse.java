/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.completeness;

import de.eshg.statistics.api.StatisticInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetCompletenessDataResponse(
    @NotNull @Valid StatisticInfo statisticInfo,
    @NotNull @Valid List<CompletenessOfAttribute> completenessOfAttributes) {}
