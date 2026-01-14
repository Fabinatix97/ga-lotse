/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.context.element.field;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.NOT_REQUIRED;

import de.eshg.inspection.checklist.api.context.element.ChecklistElementContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Objects;

@Schema(name = "CLFieldContext")
public abstract class ChecklistFieldContextDto extends ChecklistElementContextDto {
  private String text;

  @NotNull
  @Schema(requiredMode = NOT_REQUIRED) // field is not required and default is false
  private boolean mandatory;

  private String note;
  private String help;

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public boolean isMandatory() {
    return mandatory;
  }

  public void setMandatory(boolean mandatory) {
    this.mandatory = mandatory;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public String getHelp() {
    return help;
  }

  public void setHelp(String help) {
    this.help = help;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;
    ChecklistFieldContextDto that = (ChecklistFieldContextDto) o;
    return mandatory == that.mandatory
        && Objects.equals(text, that.text)
        && Objects.equals(note, that.note)
        && Objects.equals(help, that.help);
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), text, mandatory, note, help);
  }

  @Override
  public String toString() {
    return "ChecklistFieldContextDto{"
        + "text='"
        + text
        + '\''
        + ", mandatory="
        + mandatory
        + ", note='"
        + note
        + '\''
        + ", help='"
        + help
        + '\''
        + "} "
        + super.toString();
  }
}
