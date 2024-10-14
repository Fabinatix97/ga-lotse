/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "TemplateSectionElement")
public record TemplateSectionElementDto(
    @NotNull @Size(max = 200) @JsonProperty("elementType") String elementType,
    @NotNull @Valid @JsonProperty("elementData")
        TemplateSectionElementDataDto templateSectionElementData) {}
