/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence.section.element.field;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;

@Entity
@Table(indexes = @Index(columnList = "checklist_definition_element_id"))
public class ChecklistDefinitionFieldOption extends GloballyUniqueEntityBase {

  @Min(0)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int position;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String text;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String textModuleTrue;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String textModuleFalse;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_definition_element_id")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private ChecklistDefinitionElement checklistDefinitionElement;

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

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

  public ChecklistDefinitionElement getChecklistDefinitionField() {
    return checklistDefinitionElement;
  }

  public void setChecklistDefinitionElement(ChecklistDefinitionElement checklistDefinitionElement) {
    this.checklistDefinitionElement = checklistDefinitionElement;
  }
}
