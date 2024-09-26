/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.context.element.field;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;

@Schema(name = "CLCheckboxContext")
public class ChecklistCheckboxContextDto extends ChecklistFieldContextDto {
  private String textModuleTrue;
  private String textModuleFalse;

  public String getTextModuleTrue() {
    return textModuleTrue;
  }

  public void setTextModuleTrue(String textModuleTrue) {
    this.textModuleTrue = textModuleTrue;
  }

  public String getTextModuleFalse() {
    return textModuleFalse;
  }

  public void setTextModuleFalse(String textModuleFalse) {
    this.textModuleFalse = textModuleFalse;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;
    ChecklistCheckboxContextDto that = (ChecklistCheckboxContextDto) o;
    return Objects.equals(textModuleTrue, that.textModuleTrue)
        && Objects.equals(textModuleFalse, that.textModuleFalse);
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), textModuleTrue, textModuleFalse);
  }

  @Override
  public String toString() {
    return "ChecklistCheckboxContextDto{"
        + "textModuleTrue='"
        + textModuleTrue
        + '\''
        + ", textModuleFalse='"
        + textModuleFalse
        + '\''
        + "} "
        + super.toString();
  }
}
