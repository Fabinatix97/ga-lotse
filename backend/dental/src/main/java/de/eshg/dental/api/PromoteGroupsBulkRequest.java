/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record PromoteGroupsBulkRequest(
    @NotNull UUID institutionId, @NotNull @Valid List<GroupPromotionDto> groupPromotions) {}
