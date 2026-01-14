/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence.section.element.field;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

@MappedSuperclass
public abstract class ChecklistDefinitionOptionSelect extends ChecklistDefinitionField {

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = ChecklistDefinitionFieldOption_.CHECKLIST_DEFINITION_ELEMENT,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(ChecklistDefinitionFieldOption_.POSITION)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private final List<ChecklistDefinitionFieldOption> items = new ArrayList<>();

  public List<ChecklistDefinitionFieldOption> getItems() {
    return items;
  }

  public void addItem(ChecklistDefinitionFieldOption option) {
    option.setPosition(this.items.size());
    option.setChecklistDefinitionElement(this);
    this.items.add(option);
  }
}
