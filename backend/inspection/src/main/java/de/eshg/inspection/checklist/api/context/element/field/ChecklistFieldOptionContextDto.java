/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.context.element.field;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Objects;
import java.util.UUID;

@Schema(name = "CLFieldOptionContext")
public class ChecklistFieldOptionContextDto {
  @NotNull private UUID id;
  @NotNull private String text;

  private String textModuleTrue;

  private String textModuleFalse;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

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
    ChecklistFieldOptionContextDto that = (ChecklistFieldOptionContextDto) o;
    return Objects.equals(id, that.id)
        && Objects.equals(text, that.text)
        && Objects.equals(textModuleTrue, that.textModuleTrue)
        && Objects.equals(textModuleFalse, that.textModuleFalse);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, text, textModuleTrue, textModuleFalse);
  }

  @Override
  public String toString() {
    return "ChecklistFieldOptionContextDto{"
        + "id="
        + id
        + ", text='"
        + text
        + '\''
        + ", textModuleTrue='"
        + textModuleTrue
        + '\''
        + ", textModuleFalse='"
        + textModuleFalse
        + '\''
        + '}';
  }
}
