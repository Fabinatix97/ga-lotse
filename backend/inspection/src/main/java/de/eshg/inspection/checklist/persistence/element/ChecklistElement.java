/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence.element;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.checklist.persistence.ChecklistSection;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.inspection.incident.persistence.InspectionIncident;
import de.eshg.inspection.incident.persistence.InspectionIncident_;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    indexes = {
      @Index(columnList = "checklist_definition_element_id"),
      @Index(columnList = "checklist_section_id")
    })
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "element_type", discriminatorType = DiscriminatorType.STRING)
public abstract class ChecklistElement extends GloballyUniqueEntityBase {

  @Min(0)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private int position;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_section_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private ChecklistSection checklistSection;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_definition_element_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private ChecklistDefinitionElement checklistDefinitionElement;

  @OneToOne(mappedBy = InspectionIncident_.CHECKLIST_ELEMENT)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionIncident inspectionIncident;

  public abstract ChecklistElementType getType();

  public abstract ChecklistElement getCopy();

  public abstract String getValueForKey(String elementKey);

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    checkIllegalModification();
    this.position = position;
  }

  public ChecklistSection getChecklistSection() {
    return checklistSection;
  }

  public void setChecklistSection(ChecklistSection checklistSection) {
    checkIllegalModification();
    this.checklistSection = checklistSection;
  }

  public ChecklistDefinitionElement getChecklistDefinitionElement() {
    return checklistDefinitionElement;
  }

  public void setChecklistDefinitionElement(ChecklistDefinitionElement checklistDefinitionElement) {
    checkIllegalModification();
    this.checklistDefinitionElement = checklistDefinitionElement;
  }

  public InspectionIncident getInspectionIncident() {
    return inspectionIncident;
  }

  public void setInspectionIncident(InspectionIncident inspectionIncident) {
    checkIllegalModification();
    this.inspectionIncident = inspectionIncident;
    if (inspectionIncident != null) {
      inspectionIncident.setChecklistElement(this);
    }
  }

  protected ChecklistElement enrichCopy(ChecklistElement copy) {
    copy.setPosition(position);
    copy.setChecklistDefinitionElement(checklistDefinitionElement);
    return copy;
  }

  public static List<String> fieldsToHash() {
    List<String> fieldsToHash = new ArrayList<>();
    fieldsToHash.add("externalId");
    fieldsToHash.add("position");
    fieldsToHash.add("type");
    fieldsToHash.add("incident");
    fieldsToHash.add("input");
    fieldsToHash.add("isChecked");
    fieldsToHash.add("checkedButtonName");
    fieldsToHash.add("checkedButtonNames");
    fieldsToHash.add("images");
    fieldsToHash.add("audios");
    return fieldsToHash;
  }

  protected String getCommonValueForKey(String elementKey) {
    return switch (elementKey) {
      case "externalId" -> getExternalId().toString();
      case "position" -> String.valueOf(position);
      case "type" -> getType().name();
      case "incident" -> String.valueOf(inspectionIncident != null);
      default -> throw new IllegalStateException("Unexpected value: " + elementKey);
    };
  }

  protected void checkIllegalModification() {
    if (checklistSection != null) {
      checklistSection.checkIllegalModification();
    }
  }
}
