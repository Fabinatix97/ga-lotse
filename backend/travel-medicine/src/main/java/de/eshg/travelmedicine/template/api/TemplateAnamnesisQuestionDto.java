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

@Schema(name = "TemplateAnamnesisQuestion")
public record TemplateAnamnesisQuestionDto(
    @NotNull @Size(max = 200) @JsonProperty("questionText") String questionText,
    @NotNull @Valid @JsonProperty("subElementMultiSelect")
        List<TemplateSubElementMultiSelectDto> templateSubElementMultiSelects,
    @Valid @JsonProperty("subElementText") TemplateSubElementTextDto templateSubElementText) {}
