/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence.section.element.field;

import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class ChecklistDefinitionField extends ChecklistDefinitionElement {
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String text;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean mandatory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String note;

  @DataSensitivity(SensitivityLevel.PUBLIC)
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
}
