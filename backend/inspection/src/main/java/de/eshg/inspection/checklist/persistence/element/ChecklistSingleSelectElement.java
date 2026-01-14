/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
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
@DiscriminatorValue(value = ElementType.SINGLE_SELECT)
public class ChecklistSingleSelectElement extends ChecklistElement {
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String checkedButtonName;

  @Override
  public ChecklistElementType getType() {
    return ChecklistElementType.SINGLE_SELECT;
  }

  @Override
  public ChecklistElement getCopy() {
    ChecklistSingleSelectElement copiedElement = new ChecklistSingleSelectElement();
    copiedElement.setCheckedButtonName(checkedButtonName);
    return enrichCopy(copiedElement);
  }

  @Override
  public String getValueForKey(String elementKey) {
    return switch (elementKey) {
      case "checkedButtonName" -> checkedButtonName;
      default -> getCommonValueForKey(elementKey);
    };
  }

  public String getCheckedButtonName() {
    return checkedButtonName;
  }

  public void setCheckedButtonName(String checkedButtonName) {
    checkIllegalModification();
    this.checkedButtonName = checkedButtonName;
  }
}
