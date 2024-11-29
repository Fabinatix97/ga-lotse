/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;

import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Child extends SequencedBaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false, unique = true)
  private UUID childIdFromCentralFile;

  @DataSensitivity(PROTECTED)
  @Column(nullable = false)
  private Year year;

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private UUID institutionId;

  @DataSensitivity(PROTECTED)
  @Column(nullable = false)
  private String groupName;

  @DataSensitivity(PROTECTED)
  @OneToMany(orphanRemoval = true, cascade = CascadeType.PERSIST)
  @OrderBy
  private final List<Examination> examinations = new ArrayList<>();

  public UUID getChildIdFromCentralFile() {
    return childIdFromCentralFile;
  }

  public void setChildIdFromCentralFile(UUID childIdFromCentralFile) {
    this.childIdFromCentralFile = childIdFromCentralFile;
  }

  public Year getYear() {
    return year;
  }

  public void setYear(Year year) {
    this.year = year;
  }

  public UUID getInstitutionId() {
    return institutionId;
  }

  public void setInstitutionId(UUID institutionId) {
    this.institutionId = institutionId;
  }

  public String getGroupName() {
    return groupName;
  }

  public void setGroupName(String groupName) {
    this.groupName = groupName;
  }

  public List<Examination> getExaminations() {
    return examinations;
  }

  public void addExamination(Examination examination) {
    this.examinations.add(examination);
  }
}
