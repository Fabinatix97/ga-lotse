/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.texttemplate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTextTemplateRequest(
    @NotBlank String name, @NotNull TextTemplateContextDto context, @NotBlank String content) {}
