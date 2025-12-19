/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;

@Schema(name = "GroupPromotion")
public record GroupPromotionDto(
    @NotEmpty String originGroupName, @NotEmpty String targetGroupName) {}
