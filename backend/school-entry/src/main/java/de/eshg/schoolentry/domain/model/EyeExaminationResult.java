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
public class EyeExaminationResult extends GenericEntity<Long> implements ValidatableEntity {

  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private SchoolEntryProcedure procedure;

  @Embedded private EyeExaminationValues leftEye;

  @Embedded private EyeExaminationValues rightEye;

  @Embedded private ExaminationResult eyeExamination;

  @Embedded private ExaminationResult langExamination;

  @Embedded private ExaminationResult ishiharaExamination;

  private boolean amblyopia;

  private boolean astigmatism;

  private boolean colorVisionDisorder;

  private boolean hyperopia;

  private boolean myopia;

  private boolean strabismus;

  private boolean otherDiagnosis;

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

  public EyeExaminationValues getLeftEye() {
    return leftEye;
  }

  public void setLeftEye(EyeExaminationValues leftEye) {
    this.leftEye = leftEye;
  }

  public EyeExaminationValues getRightEye() {
    return rightEye;
  }

  public void setRightEye(EyeExaminationValues rightEye) {
    this.rightEye = rightEye;
  }

  public ExaminationResult getEyeExamination() {
    return eyeExamination;
  }

  public void setEyeExamination(ExaminationResult eyeExamination) {
    this.eyeExamination = eyeExamination;
  }

  public ExaminationResult getLangExamination() {
    return langExamination;
  }

  public void setLangExamination(ExaminationResult langExamination) {
    this.langExamination = langExamination;
  }

  public ExaminationResult getIshiharaExamination() {
    return ishiharaExamination;
  }

  public void setIshiharaExamination(ExaminationResult ishiharaExamination) {
    this.ishiharaExamination = ishiharaExamination;
  }

  public boolean getAmblyopia() {
    return amblyopia;
  }

  public void setAmblyopia(boolean amblyopia) {
    this.amblyopia = amblyopia;
  }

  public boolean getAstigmatism() {
    return astigmatism;
  }

  public void setAstigmatism(boolean astigmatism) {
    this.astigmatism = astigmatism;
  }

  public boolean getColorVisionDisorder() {
    return colorVisionDisorder;
  }

  public void setColorVisionDisorder(boolean colorVisionDisorder) {
    this.colorVisionDisorder = colorVisionDisorder;
  }

  public boolean getHyperopia() {
    return hyperopia;
  }

  public void setHyperopia(boolean hyperopia) {
    this.hyperopia = hyperopia;
  }

  public boolean getMyopia() {
    return myopia;
  }

  public void setMyopia(boolean myopia) {
    this.myopia = myopia;
  }

  public boolean getStrabismus() {
    return strabismus;
  }

  public void setStrabismus(boolean strabismus) {
    this.strabismus = strabismus;
  }

  public boolean getOtherDiagnosis() {
    return otherDiagnosis;
  }

  public void setOtherDiagnosis(boolean otherDiagnosis) {
    this.otherDiagnosis = otherDiagnosis;
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
            PropertyUtils.getPropertyDescriptor(
                EyeExaminationResult.class, EyeExaminationResult::getId),
            PropertyUtils.getPropertyDescriptor(
                EyeExaminationResult.class, EyeExaminationResult::getProcedure));

    return PropertyUtils.getPropertyDescriptors(EyeExaminationResult.class).stream()
        .filter(prop -> !propertiesToIgnore.contains(prop))
        .filter(PropertyUtils::isFullyAccessible);
  }

  public boolean hasEdits() {
    return getPropertiesToValidate()
        .map(prop -> PropertyUtils.read(this, prop))
        .flatMap(
            value -> {
              if (value instanceof Boolean) {
                if ((boolean) value) {
                  return Stream.of(true);
                } else {
                  return null;
                }
              }
              return Stream.of(value);
            })
        .anyMatch(Objects::nonNull);
  }
}
