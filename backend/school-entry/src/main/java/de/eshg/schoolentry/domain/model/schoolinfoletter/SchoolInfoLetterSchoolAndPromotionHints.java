/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model.schoolinfoletter;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class SchoolInfoLetterSchoolAndPromotionHints extends BaseEntity {
  @OneToOne(optional = false)
  private SchoolInfoLetterExamination schoolInfoLetterExamination;

  private boolean behavior;
  private boolean language;
  private boolean articulation;
  private boolean grammarAndVocabulary;
  private boolean auditiveInformationProcessing;
  private boolean visualPerception;
  private boolean colorsShapesNumbersSets;
  private boolean fineOrVisuoMotorSkills;
  private boolean grossMotorSkillsOrPhysicalCoordination;
  private boolean leftHandedness;

  public SchoolInfoLetterExamination getSchoolInfoLetterExamination() {
    return schoolInfoLetterExamination;
  }

  public void setSchoolInfoLetterExamination(
      SchoolInfoLetterExamination schoolInfoLetterExamination) {
    this.schoolInfoLetterExamination = schoolInfoLetterExamination;
  }

  public boolean isBehavior() {
    return behavior;
  }

  public void setBehavior(boolean behavior) {
    this.behavior = behavior;
  }

  public boolean isLanguage() {
    return language;
  }

  public void setLanguage(boolean language) {
    this.language = language;
  }

  public boolean isArticulation() {
    return articulation;
  }

  public void setArticulation(boolean articulation) {
    this.articulation = articulation;
  }

  public boolean isGrammarAndVocabulary() {
    return grammarAndVocabulary;
  }

  public void setGrammarAndVocabulary(boolean grammarAndVocabulary) {
    this.grammarAndVocabulary = grammarAndVocabulary;
  }

  public boolean isAuditiveInformationProcessing() {
    return auditiveInformationProcessing;
  }

  public void setAuditiveInformationProcessing(boolean auditiveInformationProcessing) {
    this.auditiveInformationProcessing = auditiveInformationProcessing;
  }

  public boolean isVisualPerception() {
    return visualPerception;
  }

  public void setVisualPerception(boolean visualPerception) {
    this.visualPerception = visualPerception;
  }

  public boolean isColorsShapesNumbersSets() {
    return colorsShapesNumbersSets;
  }

  public void setColorsShapesNumbersSets(boolean colorsShapesNumbersSets) {
    this.colorsShapesNumbersSets = colorsShapesNumbersSets;
  }

  public boolean isFineOrVisuoMotorSkills() {
    return fineOrVisuoMotorSkills;
  }

  public void setFineOrVisuoMotorSkills(boolean fineOrVisuoMotorSkills) {
    this.fineOrVisuoMotorSkills = fineOrVisuoMotorSkills;
  }

  public boolean isGrossMotorSkillsOrPhysicalCoordination() {
    return grossMotorSkillsOrPhysicalCoordination;
  }

  public void setGrossMotorSkillsOrPhysicalCoordination(
      boolean grossMotorSkillsOrPhysicalCoordination) {
    this.grossMotorSkillsOrPhysicalCoordination = grossMotorSkillsOrPhysicalCoordination;
  }

  public boolean isLeftHandedness() {
    return leftHandedness;
  }

  public void setLeftHandedness(boolean leftHandedness) {
    this.leftHandedness = leftHandedness;
  }
}
