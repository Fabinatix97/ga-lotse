/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.texttemplate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTextTemplateRequest(
    @NotBlank
        @Schema(description = "Display name of the text template.", example = "Hepatitis Panel")
        String name,
    @NotNull
        @Schema(
            description = "Category where the template is applicable.",
            example = "DIAGNOSIS_RESULT")
        TextTemplateContextDto context,
    @NotBlank
        @Schema(
            description = "Predefined text that will be inserted.",
            example = "Complete hepatitis A serology (acute vs. immunity)")
        String content) {}
