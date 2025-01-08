/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence.section.element;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.persistence.section.ChecklistDefinitionSection;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;

@Entity
@Table(indexes = @Index(columnList = "checklist_definition_section_id"))
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "element_type", discriminatorType = DiscriminatorType.STRING)
public abstract class ChecklistDefinitionElement extends GloballyUniqueEntityBase {

  @Min(0)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int position;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_definition_section_id")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private ChecklistDefinitionSection checklistDefinitionSection;

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public abstract ChecklistElementType getType();

  public ChecklistDefinitionSection getChecklistDefinitionSection() {
    return checklistDefinitionSection;
  }

  public void setChecklistDefinitionSection(ChecklistDefinitionSection checklistDefinitionSection) {
    this.checklistDefinitionSection = checklistDefinitionSection;
  }
}
