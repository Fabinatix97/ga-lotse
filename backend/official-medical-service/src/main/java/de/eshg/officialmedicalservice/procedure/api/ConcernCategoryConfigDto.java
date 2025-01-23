/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "ConcernCategoryConfig")
public record ConcernCategoryConfigDto(
    @NotBlank String nameDe, // category_de
    @NotBlank String nameEn, // category_en
    @NotNull @Valid List<ConcernConfigDto> concerns) {}
