/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element.field;

import de.eshg.inspection.checklist.api.context.element.field.ChecklistTextElementContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "CLTextField")
public class ChecklistTextFieldDto extends ChecklistFieldDto {

  @Valid @NotNull private ChecklistTextElementContextDto context;
  private String input;

  @SuppressWarnings("unused") // jackson needs this to resolve polymorph subtypes
  private ChecklistTextFieldDto() {}

  public ChecklistTextFieldDto(@NotNull ChecklistTextElementContextDto context, String input) {
    this.context = context;
    this.input = input;
  }

  @NotNull
  public ChecklistTextElementContextDto getContext() {
    return context;
  }

  public String getInput() {
    return input;
  }

  public void setInput(String input) {
    this.input = input;
  }
}
