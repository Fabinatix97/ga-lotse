/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element.field;

import de.eshg.inspection.checklist.api.context.element.field.ChecklistSingleSelectContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "CLSingleSelectField")
public class ChecklistSingleSelectFieldDto extends ChecklistFieldDto {

  @Valid @NotNull private ChecklistSingleSelectContextDto context;
  private String checkedButtonName;

  @SuppressWarnings("unused") // jackson needs this to resolve polymorph subtypes
  private ChecklistSingleSelectFieldDto() {}

  public ChecklistSingleSelectFieldDto(
      @NotNull ChecklistSingleSelectContextDto context, String checkedButtonName) {
    this.context = context;
    this.checkedButtonName = checkedButtonName;
  }

  @NotNull
  public ChecklistSingleSelectContextDto getContext() {
    return context;
  }

  public String getCheckedButtonName() {
    return checkedButtonName;
  }

  public void setCheckedButtonName(String checkedButtonName) {
    this.checkedButtonName = checkedButtonName;
  }
}
