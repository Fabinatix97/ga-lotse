/*
 * Copyright 2024 cronn GmbH
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
public class SopessExaminationResult extends GenericEntity<Long> implements ValidatableEntity {

  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private SchoolEntryProcedure procedure;

  private Integer jumpCount;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SopessExaminationResultValue grossMotorSkills;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DoctorLetterValue doctorLetterGrossMotorSkills;

  private Integer visuoMotor;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SopessExaminationResultValue fineMotorSkills;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DoctorLetterValue doctorLetterFineMotorSkills;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private HandednessValue handednessValue;

  private Integer visualPerceptionPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SopessExaminationResultValue visualPerceptionResult;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DoctorLetterValue doctorLetterVisualPerception;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private PrimaryLanguageValue primaryLanguage;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private LanguageKnowledgeValue germanKnowledgePrimaryCarer;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private FamilyLanguageValue familyLanguage;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private GermanKnowledgeValue germanKnowledgeChild;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue lettersSAndZPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue formationSchPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue lettersTAndDPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue formationChPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue lettersGAndKPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue lettersLAndNPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue letterRPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue letterFAndFormationPfPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue letterBPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ArticulationValue formationsTrDrKrGrPoints;

  private Integer prepositionPoints;

  private Integer pluralPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SopessExaminationResultValue speechResult;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DoctorLetterValue doctorLetterSpeech;

  private Integer pseudowordPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SopessExaminationResultValue auditiveProcessingResult;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DoctorLetterValue doctorLetterAuditiveProcessing;

  private Integer countingPoints;

  private Integer quantityKnowledgePoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SopessExaminationResultValue knowledgeThinkingResult;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DoctorLetterValue doctorLetterKnowledgeThinking;

  private Integer selectiveAttentionPoints;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SopessExaminationResultValue psychologicalBehaviorResult;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DoctorLetterValue doctorLetterPsychologicalBehavior;

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

  public Integer getJumpCount() {
    return jumpCount;
  }

  public void setJumpCount(Integer jumpCount) {
    this.jumpCount = jumpCount;
  }

  public SopessExaminationResultValue getGrossMotorSkills() {
    return grossMotorSkills;
  }

  public void setGrossMotorSkills(SopessExaminationResultValue grossMotorSkills) {
    this.grossMotorSkills = grossMotorSkills;
  }

  public DoctorLetterValue getDoctorLetterGrossMotorSkills() {
    return doctorLetterGrossMotorSkills;
  }

  public void setDoctorLetterGrossMotorSkills(DoctorLetterValue doctorLetterGrossMotorSkills) {
    this.doctorLetterGrossMotorSkills = doctorLetterGrossMotorSkills;
  }

  public Integer getVisuoMotor() {
    return visuoMotor;
  }

  public void setVisuoMotor(Integer visuoMotor) {
    this.visuoMotor = visuoMotor;
  }

  public SopessExaminationResultValue getFineMotorSkills() {
    return fineMotorSkills;
  }

  public void setFineMotorSkills(SopessExaminationResultValue fineMotorSkills) {
    this.fineMotorSkills = fineMotorSkills;
  }

  public DoctorLetterValue getDoctorLetterFineMotorSkills() {
    return doctorLetterFineMotorSkills;
  }

  public void setDoctorLetterFineMotorSkills(DoctorLetterValue doctorLetterFineMotorSkills) {
    this.doctorLetterFineMotorSkills = doctorLetterFineMotorSkills;
  }

  public HandednessValue getHandednessValue() {
    return handednessValue;
  }

  public void setHandednessValue(HandednessValue handednessValue) {
    this.handednessValue = handednessValue;
  }

  public Integer getVisualPerceptionPoints() {
    return visualPerceptionPoints;
  }

  public void setVisualPerceptionPoints(Integer visualPerceptionPoints) {
    this.visualPerceptionPoints = visualPerceptionPoints;
  }

  public SopessExaminationResultValue getVisualPerceptionResult() {
    return visualPerceptionResult;
  }

  public void setVisualPerceptionResult(SopessExaminationResultValue visualPerceptionResult) {
    this.visualPerceptionResult = visualPerceptionResult;
  }

  public DoctorLetterValue getDoctorLetterVisualPerception() {
    return doctorLetterVisualPerception;
  }

  public void setDoctorLetterVisualPerception(DoctorLetterValue doctorLetterVisualPerception) {
    this.doctorLetterVisualPerception = doctorLetterVisualPerception;
  }

  public PrimaryLanguageValue getPrimaryLanguage() {
    return primaryLanguage;
  }

  public void setPrimaryLanguage(PrimaryLanguageValue primaryLanguage) {
    this.primaryLanguage = primaryLanguage;
  }

  public LanguageKnowledgeValue getGermanKnowledgePrimaryCarer() {
    return germanKnowledgePrimaryCarer;
  }

  public void setGermanKnowledgePrimaryCarer(LanguageKnowledgeValue germanKnowledgePrimaryCarer) {
    this.germanKnowledgePrimaryCarer = germanKnowledgePrimaryCarer;
  }

  public FamilyLanguageValue getFamilyLanguage() {
    return familyLanguage;
  }

  public void setFamilyLanguage(FamilyLanguageValue familyLanguage) {
    this.familyLanguage = familyLanguage;
  }

  public GermanKnowledgeValue getGermanKnowledgeChild() {
    return germanKnowledgeChild;
  }

  public void setGermanKnowledgeChild(GermanKnowledgeValue germanKnowledgeChild) {
    this.germanKnowledgeChild = germanKnowledgeChild;
  }

  public ArticulationValue getLettersSAndZPoints() {
    return lettersSAndZPoints;
  }

  public void setLettersSAndZPoints(ArticulationValue lettersSAndZPoints) {
    this.lettersSAndZPoints = lettersSAndZPoints;
  }

  public ArticulationValue getFormationSchPoints() {
    return formationSchPoints;
  }

  public void setFormationSchPoints(ArticulationValue formationSchPoints) {
    this.formationSchPoints = formationSchPoints;
  }

  public ArticulationValue getLettersTAndDPoints() {
    return lettersTAndDPoints;
  }

  public void setLettersTAndDPoints(ArticulationValue lettersTAndDPoints) {
    this.lettersTAndDPoints = lettersTAndDPoints;
  }

  public ArticulationValue getFormationChPoints() {
    return formationChPoints;
  }

  public void setFormationChPoints(ArticulationValue formationChPoints) {
    this.formationChPoints = formationChPoints;
  }

  public ArticulationValue getLettersGAndKPoints() {
    return lettersGAndKPoints;
  }

  public void setLettersGAndKPoints(ArticulationValue lettersGAndKPoints) {
    this.lettersGAndKPoints = lettersGAndKPoints;
  }

  public ArticulationValue getLettersLAndNPoints() {
    return lettersLAndNPoints;
  }

  public void setLettersLAndNPoints(ArticulationValue lettersLAndNPoints) {
    this.lettersLAndNPoints = lettersLAndNPoints;
  }

  public ArticulationValue getLetterRPoints() {
    return letterRPoints;
  }

  public void setLetterRPoints(ArticulationValue letterRPoints) {
    this.letterRPoints = letterRPoints;
  }

  public ArticulationValue getLetterFAndFormationPfPoints() {
    return letterFAndFormationPfPoints;
  }

  public void setLetterFAndFormationPfPoints(ArticulationValue letterFAndFormationPfPoints) {
    this.letterFAndFormationPfPoints = letterFAndFormationPfPoints;
  }

  public ArticulationValue getLetterBPoints() {
    return letterBPoints;
  }

  public void setLetterBPoints(ArticulationValue letterBPoints) {
    this.letterBPoints = letterBPoints;
  }

  public ArticulationValue getFormationsTrDrKrGrPoints() {
    return formationsTrDrKrGrPoints;
  }

  public void setFormationsTrDrKrGrPoints(ArticulationValue formationsTrDrKrGrPoints) {
    this.formationsTrDrKrGrPoints = formationsTrDrKrGrPoints;
  }

  public Integer getPrepositionPoints() {
    return prepositionPoints;
  }

  public void setPrepositionPoints(Integer prepositionPoints) {
    this.prepositionPoints = prepositionPoints;
  }

  public Integer getPluralPoints() {
    return pluralPoints;
  }

  public void setPluralPoints(Integer pluralPoints) {
    this.pluralPoints = pluralPoints;
  }

  public SopessExaminationResultValue getSpeechResult() {
    return speechResult;
  }

  public void setSpeechResult(SopessExaminationResultValue speechResult) {
    this.speechResult = speechResult;
  }

  public DoctorLetterValue getDoctorLetterSpeech() {
    return doctorLetterSpeech;
  }

  public void setDoctorLetterSpeech(DoctorLetterValue doctorLetterSpeech) {
    this.doctorLetterSpeech = doctorLetterSpeech;
  }

  public Integer getPseudowordPoints() {
    return pseudowordPoints;
  }

  public void setPseudowordPoints(Integer pseudowordPoints) {
    this.pseudowordPoints = pseudowordPoints;
  }

  public SopessExaminationResultValue getAuditiveProcessingResult() {
    return auditiveProcessingResult;
  }

  public void setAuditiveProcessingResult(SopessExaminationResultValue auditiveProcessingResult) {
    this.auditiveProcessingResult = auditiveProcessingResult;
  }

  public DoctorLetterValue getDoctorLetterAuditiveProcessing() {
    return doctorLetterAuditiveProcessing;
  }

  public void setDoctorLetterAuditiveProcessing(DoctorLetterValue doctorLetterAuditiveProcessing) {
    this.doctorLetterAuditiveProcessing = doctorLetterAuditiveProcessing;
  }

  public Integer getCountingPoints() {
    return countingPoints;
  }

  public void setCountingPoints(Integer countingPoints) {
    this.countingPoints = countingPoints;
  }

  public Integer getQuantityKnowledgePoints() {
    return quantityKnowledgePoints;
  }

  public void setQuantityKnowledgePoints(Integer quantityKnowledgePoints) {
    this.quantityKnowledgePoints = quantityKnowledgePoints;
  }

  public SopessExaminationResultValue getKnowledgeThinkingResult() {
    return knowledgeThinkingResult;
  }

  public void setKnowledgeThinkingResult(SopessExaminationResultValue knowledgeThinkingResult) {
    this.knowledgeThinkingResult = knowledgeThinkingResult;
  }

  public DoctorLetterValue getDoctorLetterKnowledgeThinking() {
    return doctorLetterKnowledgeThinking;
  }

  public void setDoctorLetterKnowledgeThinking(DoctorLetterValue doctorLetterKnowledgeThinking) {
    this.doctorLetterKnowledgeThinking = doctorLetterKnowledgeThinking;
  }

  public Integer getSelectiveAttentionPoints() {
    return selectiveAttentionPoints;
  }

  public void setSelectiveAttentionPoints(Integer selectiveAttentionPoints) {
    this.selectiveAttentionPoints = selectiveAttentionPoints;
  }

  public SopessExaminationResultValue getPsychologicalBehaviorResult() {
    return psychologicalBehaviorResult;
  }

  public void setPsychologicalBehaviorResult(
      SopessExaminationResultValue psychologicalBehaviorResult) {
    this.psychologicalBehaviorResult = psychologicalBehaviorResult;
  }

  public DoctorLetterValue getDoctorLetterPsychologicalBehavior() {
    return doctorLetterPsychologicalBehavior;
  }

  public void setDoctorLetterPsychologicalBehavior(
      DoctorLetterValue doctorLetterPsychologicalBehavior) {
    this.doctorLetterPsychologicalBehavior = doctorLetterPsychologicalBehavior;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public Stream<ArticulationValue> getAllArticulationsValues() {
    return Stream.of(
        lettersSAndZPoints,
        formationSchPoints,
        lettersTAndDPoints,
        formationChPoints,
        lettersGAndKPoints,
        lettersLAndNPoints,
        letterRPoints,
        letterFAndFormationPfPoints,
        formationsTrDrKrGrPoints);
  }

  public Stream<PropertyDescriptor> getPropertiesToValidate() {
    List<PropertyDescriptor> propertiesToIgnore =
        List.of(
            PropertyUtils.getPropertyDescriptor(
                SopessExaminationResult.class, SopessExaminationResult::getId),
            PropertyUtils.getPropertyDescriptor(
                SopessExaminationResult.class, SopessExaminationResult::getProcedure));

    return PropertyUtils.getPropertyDescriptors(SopessExaminationResult.class).stream()
        .filter(prop -> !propertiesToIgnore.contains(prop))
        .filter(PropertyUtils::isFullyAccessible);
  }

  public boolean hasEdits() {
    return getPropertiesToValidate()
        .map(prop -> PropertyUtils.read(this, prop))
        .anyMatch(Objects::nonNull);
  }
}
