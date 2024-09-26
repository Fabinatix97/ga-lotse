/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence.section;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement_;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(indexes = @Index(columnList = "checklist_definition_version_id"))
public class ChecklistDefinitionSection extends GloballyUniqueEntityBase {

  @Min(0)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int position;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String title;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = ChecklistDefinitionElement_.CHECKLIST_DEFINITION_SECTION,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(ChecklistDefinitionElement_.POSITION)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private final List<ChecklistDefinitionElement> elements = new ArrayList<>();

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_definition_version_id")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private ChecklistDefinitionVersion checklistDefinitionVersion;

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public List<ChecklistDefinitionElement> getElements() {
    return elements;
  }

  public void addElement(ChecklistDefinitionElement element) {
    element.setChecklistDefinitionSection(this);
    element.setPosition(this.elements.size());
    this.elements.add(element);
  }

  public ChecklistDefinitionVersion getChecklistDefinitionVersion() {
    return checklistDefinitionVersion;
  }

  public void setChecklistDefinitionVersion(ChecklistDefinitionVersion checklistDefinitionVersion) {
    this.checklistDefinitionVersion = checklistDefinitionVersion;
  }
}
