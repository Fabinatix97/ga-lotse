/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Icd10Code")
public record Icd10CodeDto(
    @NotNull @Schema(description = "ICD-10 code or ICD-10 group code", example = "A00") String code,
    @NotNull @Schema(description = "ICD-10 code title", example = "Cholera") String title,
    @NotNull @Schema(description = "If true, the returned code specifies an ICD-10 code group.")
        boolean isGroup) {}
