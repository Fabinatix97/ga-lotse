/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.incident.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(indexes = @Index(columnList = "inspection_id"))
public class InspectionIncident extends BaseEntity {

  @Column(nullable = false, unique = true)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID incidentExternalId;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String description;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "inspection_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection inspection;

  @OneToOne(fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private ChecklistElement checklistElement;

  @Min(0)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Integer manualPosition;

  public UUID getIncidentExternalId() {
    return incidentExternalId;
  }

  public void setIncidentExternalId(UUID incidentExternalId) {
    this.incidentExternalId = incidentExternalId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Inspection getInspection() {
    return inspection;
  }

  public void setInspection(Inspection inspection) {
    this.inspection = inspection;
  }

  public ChecklistElement getChecklistElement() {
    return checklistElement;
  }

  public void setChecklistElement(ChecklistElement checklistElement) {
    this.checklistElement = checklistElement;
  }

  public Integer getChecklistNumber() {
    if (checklistElement == null) {
      return null;
    }
    return checklistElement.getChecklistSection().getChecklist().getPosition() + 1;
  }

  public Integer getSectionNumber() {
    if (checklistElement == null) {
      return null;
    }
    return checklistElement.getChecklistSection().getPosition() + 1;
  }

  public Integer getElementNumber() {
    if (checklistElement == null) {
      return null;
    }
    return checklistElement.getPosition() + 1;
  }

  public Integer getManualPosition() {
    return manualPosition;
  }

  public void setManualPosition(Integer manualPosition) {
    this.manualPosition = manualPosition;
  }

  public String createTitleForReport() {
    if (checklistElement != null) {
      return "%d.%d %s".formatted(getSectionNumber(), getElementNumber(), title);
    } else {
      return title;
    }
  }

  public InspectionIncident getCopy(Map<UUID, ChecklistElement> checklistElementCopyMap) {
    InspectionIncident copy = new InspectionIncident();
    copy.setIncidentExternalId(UUID.randomUUID());
    copy.setTitle(title);
    copy.setDescription(description);
    if (checklistElement != null) {
      ChecklistElement checklistElementCopy = checklistElementCopyMap.get(checklistElement.getId());
      checklistElementCopy.setInspectionIncident(copy);
    }
    copy.setManualPosition(manualPosition);
    return copy;
  }
}
