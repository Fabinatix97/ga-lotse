/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistorytemplate.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = "MedicalHistoryTemplateSectionElementData")
public record MedicalHistoryTemplateSectionElementDataDto(
    @NotNull @Size(max = 200) @JsonProperty("questionText") String questionText,
    @JsonProperty("answer") Boolean answer,
    @NotNull @Valid @JsonProperty("subElementMultiSelect")
        List<MedicalHistoryTemplateSubElementMultiSelectDto>
            medicalHistoryTemplateSubElementMultiSelects,
    @Valid @JsonProperty("subElementText")
        MedicalHistoryTemplateSubElementTextDto medicalHistoryTemplateSubElementText) {}
