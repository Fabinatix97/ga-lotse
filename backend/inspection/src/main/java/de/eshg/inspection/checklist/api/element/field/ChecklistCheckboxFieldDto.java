/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element.field;

import de.eshg.inspection.checklist.api.context.element.field.ChecklistCheckboxContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "CLCheckboxField")
public class ChecklistCheckboxFieldDto extends ChecklistFieldDto {

  @Valid @NotNull private ChecklistCheckboxContextDto context;
  private Boolean checked;

  @SuppressWarnings("unused") // jackson needs this to resolve polymorph subtypes
  private ChecklistCheckboxFieldDto() {}

  public ChecklistCheckboxFieldDto(@NotNull ChecklistCheckboxContextDto context, Boolean checked) {
    this.context = context;
    this.checked = checked;
  }

  @NotNull
  public ChecklistCheckboxContextDto getContext() {
    return context;
  }

  public Boolean getChecked() {
    return checked;
  }

  public void setChecked(Boolean checked) {
    this.checked = checked;
  }
}
