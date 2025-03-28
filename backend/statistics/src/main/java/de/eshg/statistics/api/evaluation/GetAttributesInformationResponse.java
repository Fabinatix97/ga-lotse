/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import de.eshg.statistics.api.AttributesInformation;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAttributesInformationResponse(
    @NotNull AggregationResultState state,
    @NotNull @Valid List<AttributesInformation> attributes) {}
