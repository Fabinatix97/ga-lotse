/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence.element;

import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import java.util.SortedSet;
import java.util.TreeSet;
import org.hibernate.annotations.SortNatural;

@Entity
@DiscriminatorValue(value = ElementType.MULTI_SELECT)
public class ChecklistMultiSelectElement extends ChecklistElement {

  @ElementCollection
  @CollectionTable(
      name = "checklist_element_checked_option",
      joinColumns = @JoinColumn(name = "id"))
  @Column(nullable = false)
  @SortNatural
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SortedSet<String> checkedButtonNames = new TreeSet<>();

  @Override
  public ChecklistElementType getType() {
    return ChecklistElementType.MULTI_SELECT;
  }

  @Override
  public ChecklistElement getCopy() {
    ChecklistMultiSelectElement copiedElement = new ChecklistMultiSelectElement();
    copiedElement.getCheckedButtonNames().addAll(checkedButtonNames);
    return enrichCopy(copiedElement);
  }

  @Override
  public String getValueForKey(String elementKey) {
    return switch (elementKey) {
      case "checkedButtonNames" -> checkedButtonNames.toString();
      default -> getCommonValueForKey(elementKey);
    };
  }

  public SortedSet<String> getCheckedButtonNames() {
    return checkedButtonNames;
  }

  public void setCheckedButtonNames(SortedSet<String> checkedButtonNames) {
    checkIllegalModification();
    this.checkedButtonNames = checkedButtonNames;
  }
}
