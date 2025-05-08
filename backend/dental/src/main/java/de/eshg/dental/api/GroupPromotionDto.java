/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;

@Schema(name = "GroupPromotion")
public record GroupPromotionDto(
    @NotEmpty String originGroupName, @NotEmpty String targetGroupName) {}
