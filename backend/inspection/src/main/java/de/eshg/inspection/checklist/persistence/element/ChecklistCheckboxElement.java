/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence.element;

import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue(value = ElementType.CHECKBOX)
public class ChecklistCheckboxElement extends ChecklistElement {
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean isChecked;

  @Override
  public ChecklistElementType getType() {
    return ChecklistElementType.CHECKBOX;
  }

  @Override
  public ChecklistElement getCopy() {
    ChecklistCheckboxElement copiedElement = new ChecklistCheckboxElement();
    copiedElement.setChecked(isChecked);
    return enrichCopy(copiedElement);
  }

  @Override
  public String getValueForKey(String elementKey) {
    return switch (elementKey) {
      case "checked" -> isChecked.toString();
      default -> getCommonValueForKey(elementKey);
    };
  }

  public Boolean isChecked() {
    return isChecked;
  }

  public void setChecked(Boolean checked) {
    checkIllegalModification();
    isChecked = checked;
  }
}
