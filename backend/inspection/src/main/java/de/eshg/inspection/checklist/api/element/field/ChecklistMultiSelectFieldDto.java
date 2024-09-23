/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element.field;

import de.eshg.inspection.checklist.api.context.element.field.ChecklistMultiSelectContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "CLMultiSelectField")
public class ChecklistMultiSelectFieldDto extends ChecklistFieldDto {

  @Valid @NotNull private ChecklistMultiSelectContextDto context;
  @NotNull private List<String> checkedButtonNames;

  @SuppressWarnings("unused") // jackson needs this to resolve polymorph subtypes
  private ChecklistMultiSelectFieldDto() {}

  public ChecklistMultiSelectFieldDto(
      @NotNull ChecklistMultiSelectContextDto context, @NotNull List<String> checkedButtonNames) {
    this.context = context;
    this.checkedButtonNames = checkedButtonNames;
  }

  @NotNull
  public ChecklistMultiSelectContextDto getContext() {
    return context;
  }

  @NotNull
  public List<String> getCheckedButtonNames() {
    return checkedButtonNames;
  }

  public void setCheckedButtonNames(@NotNull List<String> checkedButtonNames) {
    this.checkedButtonNames = checkedButtonNames;
  }
}
