/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectType.ObjectTypeNameComparator;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SortComparator;

@Entity
public class ChecklistDefinition extends GloballyUniqueEntityBase {

  /** The name of the checklist definition is always the name of the most recent version. */
  @Column(nullable = false)
  @NotNull
  @NotBlank
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String name;

  /** This field can only be set by employees of the State Office. */
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean isCoreChecklist;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Long repositoryId;

  @Min(1)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Integer mostRecentRepositoryVersion;

  @Min(1)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Integer mostRecentVersionBasedOnRepo;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = ChecklistDefinitionVersion_.CHECKLIST_DEFINITION,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(ChecklistDefinitionVersion_.VERSION)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private final List<ChecklistDefinitionVersion> versions = new ArrayList<>();

  @ManyToMany(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      fetch = FetchType.LAZY)
  @JoinTable(
      name = "checklistdefinition_objecttype",
      joinColumns = @JoinColumn(name = "checklistdefinition_id"),
      inverseJoinColumns = @JoinColumn(name = "objecttype_id"))
  @SortComparator(ObjectTypeNameComparator.class)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private SortedSet<ObjectType> objectTypes = new TreeSet<>(ObjectType.OBJECTTYPE_NAME_COMPARATOR);

  /**
   * If a checklist definition is deleted, it can not be used in an inspection. Exception:
   * inspections of type REVIEW are assigned the same checklists of their original inspection,
   * disregarding the current deleted state of checklists.
   *
   * <p>The current state is set by the most recent version.
   */
  @Column(nullable = false)
  @ColumnDefault("false")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean deleted;

  /**
   * If a checklist definition version has published = false, this CLD is considered in draft state
   * *
   *
   * <p>The current state is set by the most recent version.
   */
  @Column(nullable = false)
  @ColumnDefault("true")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean published;

  public String getName() {
    return name;
  }

  public boolean isCoreChecklist() {
    return isCoreChecklist;
  }

  public void setCoreChecklist(boolean coreChecklist) {
    isCoreChecklist = coreChecklist;
  }

  public Long getRepositoryId() {
    return repositoryId;
  }

  public void setRepositoryId(Long repositoryId) {
    this.repositoryId = repositoryId;
  }

  public Integer getMostRecentRepositoryVersion() {
    return mostRecentRepositoryVersion;
  }

  public void setMostRecentRepositoryVersion(Integer mostRecentRepositoryVersion) {
    this.mostRecentRepositoryVersion = mostRecentRepositoryVersion;
  }

  public Integer getMostRecentVersionBasedOnRepo() {
    return mostRecentVersionBasedOnRepo;
  }

  public void setMostRecentVersionBasedOnRepo(Integer mostRecentVersionBasedOnRepo) {
    this.mostRecentVersionBasedOnRepo = mostRecentVersionBasedOnRepo;
  }

  public List<ChecklistDefinitionVersion> getVersions() {
    return versions;
  }

  public void addNewVersion(ChecklistDefinitionVersion version) {
    name = version.getName();
    version.setChecklistDefinition(this);
    versions.add(version);
  }

  public SortedSet<ObjectType> getObjectTypes() {
    return objectTypes;
  }

  public void setObjectTypes(SortedSet<ObjectType> objectTypes) {
    this.objectTypes = objectTypes;
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

  public void setPublished(boolean published) {
    this.published = published;
  }
}
