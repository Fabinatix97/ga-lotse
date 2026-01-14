/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Icd10CodeWithOriginalCode")
public record Icd10CodeWithOriginalCodeDto(
    @NotNull @Schema(description = "ICD-10 code or ICD-10 group code", example = "A00") String code,
    @NotNull
        @Schema(
            description = "ICD-10 code with special characters or ICD-10 group code",
            example = "A00.-")
        String originalCode) {}
