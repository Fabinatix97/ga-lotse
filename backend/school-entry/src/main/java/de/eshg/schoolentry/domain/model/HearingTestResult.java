/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.cronn.reflection.util.PropertyUtils;
import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import java.beans.PropertyDescriptor;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Entity
@DataSensitivity(SENSITIVE)
public class HearingTestResult extends GenericEntity<Long> implements ValidatableEntity {

  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private SchoolEntryProcedure procedure;

  @Embedded private HearingTestValues leftEar;

  @Embedded private HearingTestValues rightEar;

  @Embedded private ExaminationResult examinationResult;

  private String note;

  @Override
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public SchoolEntryProcedure getProcedure() {
    return procedure;
  }

  void setProcedure(SchoolEntryProcedure procedure) {
    this.procedure = procedure;
  }

  public HearingTestValues getLeftEar() {
    return leftEar;
  }

  public void setLeftEar(HearingTestValues leftEar) {
    this.leftEar = leftEar;
  }

  public HearingTestValues getRightEar() {
    return rightEar;
  }

  public void setRightEar(HearingTestValues rightEar) {
    this.rightEar = rightEar;
  }

  public ExaminationResult getExaminationResult() {
    return examinationResult;
  }

  public void setExaminationResult(ExaminationResult hearingTestExaminationResult) {
    this.examinationResult = hearingTestExaminationResult;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public Stream<PropertyDescriptor> getPropertiesToValidate() {
    List<PropertyDescriptor> propertiesToIgnore =
        List.of(
            PropertyUtils.getPropertyDescriptor(HearingTestResult.class, HearingTestResult::getId),
            PropertyUtils.getPropertyDescriptor(
                HearingTestResult.class, HearingTestResult::getProcedure));

    return PropertyUtils.getPropertyDescriptors(HearingTestResult.class).stream()
        .filter(prop -> !propertiesToIgnore.contains(prop))
        .filter(PropertyUtils::isFullyAccessible);
  }

  public boolean hasEdits() {
    return getPropertiesToValidate()
        .map(prop -> PropertyUtils.read(this, prop))
        .anyMatch(Objects::nonNull);
  }
}
