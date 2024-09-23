/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence.section.element.field;

import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue(value = ElementType.CHECKBOX)
public class ChecklistDefinitionCheckbox extends ChecklistDefinitionField {
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String textModuleTrue;

  @DataSensitivity(SensitivityLevel.PUBLIC)
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
  public ChecklistElementType getType() {
    return ChecklistElementType.CHECKBOX;
  }
}
