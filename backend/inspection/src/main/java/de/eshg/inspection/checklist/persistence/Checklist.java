/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.common.persistence.HashAlgorithm;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(
    indexes = {@Index(columnList = "checklist_version_id"), @Index(columnList = "inspection_id")})
public class Checklist extends GloballyUniqueEntityBase {

  @Min(0)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private int position;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_version_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private ChecklistDefinitionVersion checklistDefinitionVersion;

  @NotNull
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "inspection_id", nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection inspection;

  @NotNull
  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = ChecklistSection_.CHECKLIST,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(ChecklistSection_.POSITION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<ChecklistSection> sections = new ArrayList<>();

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String hashValue;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String hashedFields;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private HashAlgorithm hashAlgorithm;

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    checkIllegalModification();
    this.position = position;
  }

  public ChecklistDefinitionVersion getChecklistDefinitionVersion() {
    return checklistDefinitionVersion;
  }

  public void setChecklistDefinitionVersion(ChecklistDefinitionVersion checklistDefinitionVersion) {
    checkIllegalModification();
    this.checklistDefinitionVersion = checklistDefinitionVersion;
  }

  public List<ChecklistSection> getSections() {
    return sections;
  }

  public void addSection(ChecklistSection section) {
    checkIllegalModification();
    section.setPosition(this.sections.size());
    section.setChecklist(this);
    this.sections.add(section);
  }

  private void addCopiedSection(ChecklistSection section) {
    checkIllegalModification();
    section.setChecklist(this);
    this.sections.add(section);
  }

  public Inspection getInspection() {
    return inspection;
  }

  public void setInspection(Inspection inspection) {
    checkIllegalModification();
    this.inspection = inspection;
  }

  public String getHashValue() {
    return hashValue;
  }

  public void setHashValue(String hashValue) {
    checkIllegalHashModification();
    this.hashValue = hashValue;
  }

  public String getHashedFields() {
    return hashedFields;
  }

  public void setHashedFields(String hashedFields) {
    checkIllegalHashModification();
    this.hashedFields = hashedFields;
  }

  public HashAlgorithm getHashAlgorithm() {
    return hashAlgorithm;
  }

  public void setHashAlgorithm(HashAlgorithm hashAlgorithm) {
    checkIllegalHashModification();
    this.hashAlgorithm = hashAlgorithm;
  }

  public Checklist getCopy() {
    Checklist copy = new Checklist();
    copy.setPosition(position);
    copy.setChecklistDefinitionVersion(checklistDefinitionVersion);
    sections.stream().map(ChecklistSection::getCopy).forEach(copy::addCopiedSection);
    return copy;
  }

  public static List<String> fieldsToHash() {
    List<String> fieldsToHash = new ArrayList<>();
    fieldsToHash.add("externalId");
    fieldsToHash.add("position");
    return fieldsToHash;
  }

  public String getValueForKey(String checklistKey) {
    return switch (checklistKey) {
      case "externalId" -> getExternalId().toString();
      case "position" -> String.valueOf(position);
      default -> throw new IllegalStateException("Unexpected value: " + checklistKey);
    };
  }

  public void checkIllegalModification() {
    if (inspection != null
        && inspection.getExecutionTask().isPresent()
        && inspection.getExecutionTask().get().getTaskStatus() == TaskStatus.CLOSED) {
      throw new BadRequestException(
          ErrorCode.DATA_INTEGRITY_VIOLATION,
          "Inspection has already been executed; modification of checklist is not allowed");
    }
  }

  private void checkIllegalHashModification() {
    if (hashValue != null) {
      throw new BadRequestException(
          ErrorCode.DATA_INTEGRITY_VIOLATION,
          "Checklist has already a hash value; modification of checklist hash is not allowed");
    }
  }
}
