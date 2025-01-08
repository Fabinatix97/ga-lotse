/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement_;
import de.eshg.inspection.checklistdefinition.persistence.section.ChecklistDefinitionSection;
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
@Table(
    indexes = {
      @Index(columnList = "checklist_definition_section_id"),
      @Index(columnList = "checklist_id")
    })
public class ChecklistSection extends GloballyUniqueEntityBase {

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Checklist checklist;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_definition_section_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private ChecklistDefinitionSection checklistDefinitionSection;

  @Min(0)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private int position;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = ChecklistElement_.CHECKLIST_SECTION,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(ChecklistElement_.POSITION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<ChecklistElement> elements = new ArrayList<>();

  public Checklist getChecklist() {
    return checklist;
  }

  public void setChecklist(Checklist checklist) {
    checkIllegalModification();
    this.checklist = checklist;
  }

  public ChecklistDefinitionSection getChecklistDefinitionSection() {
    return checklistDefinitionSection;
  }

  public void setChecklistDefinitionSection(ChecklistDefinitionSection checklistDefinitionSection) {
    checkIllegalModification();
    this.checklistDefinitionSection = checklistDefinitionSection;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    checkIllegalModification();
    this.position = position;
  }

  public List<ChecklistElement> getElements() {
    return elements;
  }

  public void addElement(ChecklistElement element) {
    checkIllegalModification();
    element.setPosition(this.elements.size());
    element.setChecklistSection(this);
    this.elements.add(element);
  }

  private void addCopiedElement(ChecklistElement element) {
    checkIllegalModification();
    element.setChecklistSection(this);
    this.elements.add(element);
  }

  ChecklistSection getCopy() {
    ChecklistSection copy = new ChecklistSection();
    copy.setPosition(position);
    copy.setChecklistDefinitionSection(checklistDefinitionSection);
    elements.stream().map(ChecklistElement::getCopy).forEach(copy::addCopiedElement);
    return copy;
  }

  public static List<String> fieldsToHash() {
    List<String> fieldsToHash = new ArrayList<>();
    fieldsToHash.add("externalId");
    fieldsToHash.add("position");
    return fieldsToHash;
  }

  public String getValueForKey(String sectionKey) {
    return switch (sectionKey) {
      case "externalId" -> getExternalId().toString();
      case "position" -> String.valueOf(position);
      default -> throw new IllegalStateException("Unexpected value: " + sectionKey);
    };
  }

  public void checkIllegalModification() {
    if (checklist != null) {
      checklist.checkIllegalModification();
    }
  }
}
