/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SetMatterOfConcernRequest(
    @Schema(description = "The matter of concern for the GDPR procedure.") @NotBlank String concern,
    @NotNull long version) {}
