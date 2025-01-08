/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = "TemplateSection")
public record TemplateSectionDto(
    @JsonProperty("sectionTitle") @Size(max = 200) String sectionTitle,
    @NotNull @Valid @Size(min = 1) @JsonProperty("sectionElements")
        List<TemplateSectionElementDto> templateSectionElements) {}
