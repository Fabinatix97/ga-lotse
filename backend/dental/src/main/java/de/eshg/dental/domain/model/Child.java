/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;
import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.apache.commons.lang3.BooleanUtils;
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
  private String groupName;

  @DataSensitivity(PROTECTED)
  private String note;

  @ManyToMany
  @OrderBy
  @DataSensitivity(PSEUDONYMIZED)
  @BatchSize(size = 100)
  private List<ProcedureLabel> procedureLabels = new ArrayList<>();

  @DataSensitivity(PROTECTED)
  @OneToMany(
      orphanRemoval = true,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = Examination_.CHILD)
  @BatchSize(size = 100)
  @OrderBy
  private final List<Examination> examinations = new ArrayList<>();

  @DataSensitivity(SENSITIVE)
  @ElementCollection
  @OrderColumn
  @BatchSize(size = 100)
  private final List<FluoridationConsent> fluoridationConsents = new ArrayList<>();

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

  public List<ProcedureLabel> getProcedureLabels() {
    return procedureLabels;
  }

  public void setProcedureLabels(List<ProcedureLabel> labels) {
    this.procedureLabels = labels;
  }

  public void addProcedureLabel(ProcedureLabel label) {
    this.procedureLabels.add(label);
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

  public List<FluoridationConsent> getFluoridationConsents() {
    return fluoridationConsents;
  }

  public FluoridationConsent getLatestFluoridationConsentAtDate(LocalDate date) {
    return fluoridationConsents.stream()
        .filter(
            consent ->
                consent.getDateOfConsent() != null && !consent.getDateOfConsent().isAfter(date))
        .max(
            Comparator.comparing(FluoridationConsent::getDateOfConsent)
                .thenComparing(FluoridationConsent::getModifiedAt))
        .orElse(null);
  }

  public FluoridationConsent getLatestFluoridationConsent() {
    return fluoridationConsents.stream()
        .max(
            Comparator.comparing(FluoridationConsent::getDateOfConsent)
                .thenComparing(FluoridationConsent::getModifiedAt))
        .orElse(null);
  }

  @Nullable
  public Boolean isFluoridationConsentGivenAtDateOptionally(LocalDate dateOfExamination) {
    if (getLatestFluoridationConsentAtDate(dateOfExamination) == null) {
      return null;
    }
    return getLatestFluoridationConsentAtDate(dateOfExamination).isConsented();
  }

  public boolean isFluoridationConsentGivenAtDate(LocalDate dateOfExamination) {
    return BooleanUtils.isTrue(isFluoridationConsentGivenAtDateOptionally(dateOfExamination));
  }

  public void addFluoridationConsent(FluoridationConsent fluoridationConsent) {
    this.fluoridationConsents.add(fluoridationConsent);
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
