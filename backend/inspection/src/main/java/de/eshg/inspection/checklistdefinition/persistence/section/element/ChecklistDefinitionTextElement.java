/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence.section.element;

import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionField;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue(value = ElementType.TEXT)
@DataSensitivity(SensitivityLevel.PUBLIC)
public class ChecklistDefinitionTextElement extends ChecklistDefinitionField {

  @Override
  public ChecklistElementType getType() {
    return ChecklistElementType.TEXT;
  }
}
