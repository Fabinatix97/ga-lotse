/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "TemplateSubElementText")
public record TemplateSubElementTextDto(
    @NotNull @Size(max = 200) String questionText,
    @Size(max = 4000) @JsonProperty("answer")
        String answer) {} // no min size as reset answers use empty string
