/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
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
@DiscriminatorValue(value = ElementType.TEXT)
public class ChecklistTextElement extends ChecklistElement {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String input;

  @Override
  public ChecklistElementType getType() {
    return ChecklistElementType.TEXT;
  }

  @Override
  public ChecklistElement getCopy() {
    ChecklistTextElement copiedElement = new ChecklistTextElement();
    copiedElement.setInput(input);
    return enrichCopy(copiedElement);
  }

  @Override
  public String getValueForKey(String elementKey) {
    return switch (elementKey) {
      case "input" -> input;
      default -> getCommonValueForKey(elementKey);
    };
  }

  public String getInput() {
    return input;
  }

  public void setInput(String text) {
    checkIllegalModification();
    this.input = text;
  }
}
