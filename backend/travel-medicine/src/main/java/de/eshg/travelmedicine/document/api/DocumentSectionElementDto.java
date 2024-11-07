/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;

@Schema(name = "DocumentSectionElement")
public record DocumentSectionElementDto(
    @Valid DocumentAnamnesisQuestionDto anamnesisQuestion,
    @Valid DocumentTextBlockDto textBlock,
    @Valid DocumentConfirmationDto confirmation) {

  @AssertTrue(message = "Only either one of the properties is allowed to be defined")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isSolelyOnePropertyDefined() {
    return isAnamnesisQuestionSolely() || isTextBlockSolely() || isConfirmationSolely();
  }

  @JsonIgnore
  public boolean isAnamnesisQuestionSolely() {
    return anamnesisQuestion != null && textBlock == null && confirmation == null;
  }

  @JsonIgnore
  public boolean isTextBlockSolely() {
    return textBlock != null && anamnesisQuestion == null && confirmation == null;
  }

  @JsonIgnore
  public boolean isConfirmationSolely() {
    return confirmation != null && textBlock == null && anamnesisQuestion == null;
  }
}
