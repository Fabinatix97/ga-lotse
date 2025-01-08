/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
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
@DiscriminatorValue(value = ElementType.SINGLE_SELECT)
@DataSensitivity(SensitivityLevel.PUBLIC)
public class ChecklistDefinitionSingleSelect extends ChecklistDefinitionOptionSelect {

  @Override
  public ChecklistElementType getType() {
    return ChecklistElementType.SINGLE_SELECT;
  }
}
