/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;

@Schema(name = "TemplateSectionElement")
public record TemplateSectionElementDto(
    @JsonProperty("anamnesisQuestion") @Valid
        TemplateAnamnesisQuestionDto templateAnamnesisQuestionDto,
    @JsonProperty("textBlock") @Valid TemplateTextBlockDto templateTextBlockDto,
    @JsonProperty("confirmation") @Valid TemplateConfirmationDto templateConfirmationDto) {

  @AssertTrue(message = "Only either one of the properties is allowed to be defined")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isSolelyOnePropertyDefined() {
    return isTemplateAnamnesisQuestionSolely()
        || isTemplateTextBlockSolely()
        || isTemplateConfirmationSolely();
  }

  @JsonIgnore
  private boolean isTemplateAnamnesisQuestionSolely() {
    return templateAnamnesisQuestionDto != null
        && templateTextBlockDto == null
        && templateConfirmationDto == null;
  }

  @JsonIgnore
  private boolean isTemplateTextBlockSolely() {
    return templateTextBlockDto != null
        && templateAnamnesisQuestionDto == null
        && templateConfirmationDto == null;
  }

  @JsonIgnore
  private boolean isTemplateConfirmationSolely() {
    return templateConfirmationDto != null
        && templateTextBlockDto == null
        && templateAnamnesisQuestionDto == null;
  }
}
