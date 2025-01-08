/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;

@Entity
public class Child extends Procedure<Child, ChildTask, Person, Facility> {

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
  @OneToMany(
      orphanRemoval = true,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = Examination_.CHILD)
  @BatchSize(size = 100)
  @OrderBy
  private final List<Examination> examinations = new ArrayList<>();

  public UUID getChildIdFromCentralFile() {
    return getChild().getCentralFileStateId();
  }

  public Person getChild() {
    return getRelatedPersons().stream()
        .filter(Person::isChild)
        .collect(StreamUtil.toSingleElement());
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
    examination.setChild(this);
  }

  public void removeExamination(Examination examination) {
    this.examinations.remove(examination);
    examination.setChild(null);
  }
}
