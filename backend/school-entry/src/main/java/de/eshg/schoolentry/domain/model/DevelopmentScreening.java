/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.cronn.reflection.util.PropertyUtils;
import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import java.beans.PropertyDescriptor;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
// This class should be named DevelopmentScreeningResult but this leads to long database identifiers
public class DevelopmentScreening extends GenericEntity<Long> implements ValidatableEntity {

  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private SchoolEntryProcedure procedure;

  private Double height;

  private Double weight;

  private Integer systole;

  private Integer diastole;

  private ExaminationWithDiagnosis nutritionalCondition;

  private ExaminationWithDiagnosis neurology;

  private ExaminationWithDiagnosis respiratoryCardiovascular;

  private ExaminationWithDiagnosis skin;

  private ExaminationWithDiagnosis musculatureSkeleton;

  private ExaminationWithDiagnosis metabolism;

  private ExaminationWithDiagnosis abdomen;

  private ExaminationWithDiagnosis earNoseThroat;

  private String physicalExaminationNote;

  private HandicapWithDiagnosis chronicDisease;

  private HandicapWithDiagnosis disability;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DisabilityType disabilityType;

  private String handicapNote;

  private Boolean family;

  private Boolean nonCompliance;

  private Boolean social;

  private Boolean migration;

  private Boolean otherRisk;

  private Boolean reIntroduction;

  private Boolean schoolCounselling;

  private Boolean motorPromotion;

  private Boolean educationalAdvice;

  private Boolean languageAdvice;

  private Boolean nutritionalAdvice;

  private Boolean vaccinationAdvice;

  private Boolean socialService;

  private Boolean otherSupport;

  private Boolean infoLetter;

  private Boolean extraEffort;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolRecommendation schoolRecommendation;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolFeedback schoolFeedback;

  private Double heightPercentile;

  private Double weightPercentile;

  private Double bmi;

  private Double bmiPercentile;

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

  public Double getHeight() {
    return height;
  }

  public void setHeight(Double height) {
    this.height = height;
  }

  public Double getWeight() {
    return weight;
  }

  public void setWeight(Double weight) {
    this.weight = weight;
  }

  public Integer getSystole() {
    return systole;
  }

  public void setSystole(Integer systole) {
    this.systole = systole;
  }

  public Integer getDiastole() {
    return diastole;
  }

  public void setDiastole(Integer diastole) {
    this.diastole = diastole;
  }

  public ExaminationWithDiagnosis getNutritionalCondition() {
    return nutritionalCondition;
  }

  public void setNutritionalCondition(ExaminationWithDiagnosis examinationWithDiagnosis) {
    this.nutritionalCondition = examinationWithDiagnosis;
  }

  public ExaminationWithDiagnosis getNeurology() {
    return neurology;
  }

  public void setNeurology(ExaminationWithDiagnosis neurology) {
    this.neurology = neurology;
  }

  public ExaminationWithDiagnosis getRespiratoryCardiovascular() {
    return respiratoryCardiovascular;
  }

  public void setRespiratoryCardiovascular(ExaminationWithDiagnosis respiratoryCardiovascular) {
    this.respiratoryCardiovascular = respiratoryCardiovascular;
  }

  public ExaminationWithDiagnosis getSkin() {
    return skin;
  }

  public void setSkin(ExaminationWithDiagnosis skin) {
    this.skin = skin;
  }

  public ExaminationWithDiagnosis getMusculatureSkeleton() {
    return musculatureSkeleton;
  }

  public void setMusculatureSkeleton(ExaminationWithDiagnosis musculatureSkeleton) {
    this.musculatureSkeleton = musculatureSkeleton;
  }

  public ExaminationWithDiagnosis getMetabolism() {
    return metabolism;
  }

  public void setMetabolism(ExaminationWithDiagnosis metabolism) {
    this.metabolism = metabolism;
  }

  public ExaminationWithDiagnosis getAbdomen() {
    return abdomen;
  }

  public void setAbdomen(ExaminationWithDiagnosis abdomen) {
    this.abdomen = abdomen;
  }

  public ExaminationWithDiagnosis getEarNoseThroat() {
    return earNoseThroat;
  }

  public void setEarNoseThroat(ExaminationWithDiagnosis earNoseThroat) {
    this.earNoseThroat = earNoseThroat;
  }

  public String getPhysicalExaminationNote() {
    return physicalExaminationNote;
  }

  public void setPhysicalExaminationNote(String physicalExaminationNote) {
    this.physicalExaminationNote = physicalExaminationNote;
  }

  public HandicapWithDiagnosis getChronicDisease() {
    return chronicDisease;
  }

  public void setChronicDisease(HandicapWithDiagnosis chronicDisease) {
    this.chronicDisease = chronicDisease;
  }

  public HandicapWithDiagnosis getDisability() {
    return disability;
  }

  public void setDisability(HandicapWithDiagnosis disability) {
    this.disability = disability;
  }

  public DisabilityType getDisabilityType() {
    return disabilityType;
  }

  public void setDisabilityType(DisabilityType disabilityType) {
    this.disabilityType = disabilityType;
  }

  public String getHandicapNote() {
    return handicapNote;
  }

  public void setHandicapNote(String handicapNote) {
    this.handicapNote = handicapNote;
  }

  public Boolean getFamily() {
    return family;
  }

  public void setFamily(Boolean family) {
    this.family = family;
  }

  public Boolean getNonCompliance() {
    return nonCompliance;
  }

  public void setNonCompliance(Boolean nonCompliance) {
    this.nonCompliance = nonCompliance;
  }

  public Boolean getSocial() {
    return social;
  }

  public void setSocial(Boolean social) {
    this.social = social;
  }

  public Boolean getMigration() {
    return migration;
  }

  public void setMigration(Boolean migration) {
    this.migration = migration;
  }

  public Boolean getOtherRisk() {
    return otherRisk;
  }

  public void setOtherRisk(Boolean otherRisk) {
    this.otherRisk = otherRisk;
  }

  public Boolean getReIntroduction() {
    return reIntroduction;
  }

  public void setReIntroduction(Boolean reIntroduction) {
    this.reIntroduction = reIntroduction;
  }

  public Boolean getSchoolCounselling() {
    return schoolCounselling;
  }

  public void setSchoolCounselling(Boolean schoolCounselling) {
    this.schoolCounselling = schoolCounselling;
  }

  public Boolean getMotorPromotion() {
    return motorPromotion;
  }

  public void setMotorPromotion(Boolean motorPromotion) {
    this.motorPromotion = motorPromotion;
  }

  public Boolean getEducationalAdvice() {
    return educationalAdvice;
  }

  public void setEducationalAdvice(Boolean educationalAdvice) {
    this.educationalAdvice = educationalAdvice;
  }

  public Boolean getLanguageAdvice() {
    return languageAdvice;
  }

  public void setLanguageAdvice(Boolean languageAdvice) {
    this.languageAdvice = languageAdvice;
  }

  public Boolean getNutritionalAdvice() {
    return nutritionalAdvice;
  }

  public void setNutritionalAdvice(Boolean nutritionalAdvice) {
    this.nutritionalAdvice = nutritionalAdvice;
  }

  public Boolean getVaccinationAdvice() {
    return vaccinationAdvice;
  }

  public void setVaccinationAdvice(Boolean vaccinationAdvice) {
    this.vaccinationAdvice = vaccinationAdvice;
  }

  public Boolean getSocialService() {
    return socialService;
  }

  public void setSocialService(Boolean socialService) {
    this.socialService = socialService;
  }

  public Boolean getOtherSupport() {
    return otherSupport;
  }

  public void setOtherSupport(Boolean otherSupport) {
    this.otherSupport = otherSupport;
  }

  public Boolean getInfoLetter() {
    return infoLetter;
  }

  public void setInfoLetter(Boolean infoLetter) {
    this.infoLetter = infoLetter;
  }

  public Boolean getExtraEffort() {
    return extraEffort;
  }

  public void setExtraEffort(Boolean extraEffort) {
    this.extraEffort = extraEffort;
  }

  public SchoolRecommendation getSchoolRecommendation() {
    return schoolRecommendation;
  }

  public void setSchoolRecommendation(SchoolRecommendation schoolRecommendation) {
    this.schoolRecommendation = schoolRecommendation;
  }

  public SchoolFeedback getSchoolFeedback() {
    return schoolFeedback;
  }

  public void setSchoolFeedback(SchoolFeedback schoolFeedback) {
    this.schoolFeedback = schoolFeedback;
  }

  public Double getHeightPercentile() {
    return heightPercentile;
  }

  public void setHeightPercentile(Double heightPercentile) {
    this.heightPercentile = heightPercentile;
  }

  public Double getWeightPercentile() {
    return weightPercentile;
  }

  public void setWeightPercentile(Double weightPercentile) {
    this.weightPercentile = weightPercentile;
  }

  public Double getBmi() {
    return bmi;
  }

  public void setBmi(Double bmi) {
    this.bmi = bmi;
  }

  public Double getBmiPercentile() {
    return bmiPercentile;
  }

  public void setBmiPercentile(Double bmiPercentile) {
    this.bmiPercentile = bmiPercentile;
  }

  public Stream<PropertyDescriptor> getPropertiesToValidate() {
    List<PropertyDescriptor> propertiesToIgnore =
        List.of(
            PropertyUtils.getPropertyDescriptor(
                DevelopmentScreening.class, DevelopmentScreening::getId),
            PropertyUtils.getPropertyDescriptor(
                DevelopmentScreening.class, DevelopmentScreening::getProcedure));

    return PropertyUtils.getPropertyDescriptors(DevelopmentScreening.class).stream()
        .filter(prop -> !propertiesToIgnore.contains(prop))
        .filter(PropertyUtils::isFullyAccessible);
  }

  public boolean hasEdits() {
    return getPropertiesToValidate()
        .map(prop -> PropertyUtils.read(this, prop))
        .flatMap(
            value -> {
              if (value instanceof ExaminationWithDiagnosis examinationWithDiagnosis) {
                return Stream.of((examinationWithDiagnosis).getResult());
              } else if (value instanceof HandicapWithDiagnosis handicapWithDiagnosis) {
                return Stream.of((handicapWithDiagnosis).getResult());
              }
              return Stream.of(value);
            })
        .anyMatch(Objects::nonNull);
  }
}
