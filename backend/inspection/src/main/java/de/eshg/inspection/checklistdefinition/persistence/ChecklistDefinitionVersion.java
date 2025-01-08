/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence;

import de.eshg.inspection.checklistdefinition.persistence.section.ChecklistDefinitionSection;
import de.eshg.inspection.checklistdefinition.persistence.section.ChecklistDefinitionSection_;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(
    uniqueConstraints =
        @UniqueConstraint(
            name = "uk_checklist_definition_version",
            columnNames = {"checklist_definition_id", "version"}))
public class ChecklistDefinitionVersion {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private UUID id;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String name;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String description;

  @Column()
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant validFrom;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant validTo;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private UUID modifiedBy;

  @Column(nullable = false)
  @NotNull
  @Min(1)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int version;

  @Min(1)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Integer repositoryVersion;

  /**
   * This field can only be set to false by employees of the State Office and only if
   * checklistDefinition.isCoreChecklist==true.
   */
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean isExpandable = true;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @LastModifiedDate
  private Instant lastModified;

  @NotNull
  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = ChecklistDefinitionSection_.CHECKLIST_DEFINITION_VERSION,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(ChecklistDefinitionSection_.POSITION)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private final List<ChecklistDefinitionSection> sections = new ArrayList<>();

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "checklist_definition_id")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private ChecklistDefinition checklistDefinition;

  /**
   * If a checklist definition is deleted, it can not be used in an inspection. Exception:
   * inspections of type REVIEW are assigned the same checklists of their original inspection,
   * disregarding the current deleted state of checklists.
   */
  @Column(nullable = false)
  @ColumnDefault("false")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean deleted = false;

  /**
   * If a checklist definition version has published = false, this CLD is considered in published
   * state
   */
  @Column(nullable = false)
  @ColumnDefault("true")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean published = true;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String checklistName) {
    this.name = checklistName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Instant getValidFrom() {
    return validFrom;
  }

  public void setValidFrom(Instant validFrom) {
    this.validFrom = validFrom;
  }

  public Instant getValidTo() {
    return validTo;
  }

  public void setValidTo(Instant validTo) {
    this.validTo = validTo;
  }

  public UUID getModifiedBy() {
    return modifiedBy;
  }

  public void setModifiedBy(UUID modifiedBy) {
    this.modifiedBy = modifiedBy;
  }

  public int getVersion() {
    return version;
  }

  public void setVersion(int version) {
    this.version = version;
  }

  public Integer getRepositoryVersion() {
    return repositoryVersion;
  }

  public void setRepositoryVersion(Integer repositoryVersion) {
    this.repositoryVersion = repositoryVersion;
  }

  public boolean isExpandable() {
    return isExpandable;
  }

  public void setExpandable(boolean expandable) {
    if (!this.getChecklistDefinition().isCoreChecklist() && !expandable) {
      throw new IllegalArgumentException(
          "setting a version to non-expandable is only allowed for core checklists");
    }
    isExpandable = expandable;
  }

  public @NotNull Instant getLastModified() {
    return lastModified;
  }

  public void setLastModified(@NotNull Instant lastModified) {
    this.lastModified = lastModified;
  }

  public List<ChecklistDefinitionSection> getSections() {
    return sections;
  }

  public void addSection(ChecklistDefinitionSection section) {
    section.setPosition(this.sections.size());
    section.setChecklistDefinitionVersion(this);
    this.sections.add(section);
  }

  public ChecklistDefinition getChecklistDefinition() {
    return checklistDefinition;
  }

  public void setChecklistDefinition(ChecklistDefinition checklistDefinition) {
    this.checklistDefinition = checklistDefinition;
  }

  public boolean isDeleted() {
    return deleted;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
  }

  public boolean isPublished() {
    return published;
  }

  public void setPublished(boolean draft) {
    this.published = draft;
  }

  @PrePersist
  @PreUpdate
  private void validate() {
    if (this.validFrom == null && this.published) {
      throw new ConstraintViolationException(
          "validFrom can not be null for published checklist definition versions", null);
    }
  }
}
