/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record PromoteGroupsBulkRequest(
    @NotNull UUID institutionId, @NotNull @Valid List<GroupPromotionDto> groupPromotions) {}
