/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SopessExaminationResult")
public class SopessExaminationResultDto {

  @NotNull private long version;

  @Valid @NotNull
  private ScoredEvaluationExaminationDto grossMotorSkills = new ScoredEvaluationExaminationDto();

  @Valid @NotNull
  private ScoredEvaluationExaminationDto fineMotorSkills = new ScoredEvaluationExaminationDto();

  private HandednessValueDto handedness;

  @Valid @NotNull
  private ScoredEvaluationExaminationDto visualPerceptionResult =
      new ScoredEvaluationExaminationDto();

  @Valid @NotNull private SopessLanguageDto language = new SopessLanguageDto();
  @Valid @NotNull private ArticulationDto articulation = new ArticulationDto();

  @Valid @NotNull
  private SpeechEvaluationExaminationDto speechResult = new SpeechEvaluationExaminationDto();

  @Valid @NotNull
  private ScoredEvaluationExaminationDto auditiveProcessingResult =
      new ScoredEvaluationExaminationDto();

  @Valid @NotNull
  private KnowledgeThinkingExaminationDto knowledgeThinkingResult =
      new KnowledgeThinkingExaminationDto();

  @Valid @NotNull
  private ScoredEvaluationExaminationDto psychologicalBehaviorResult =
      new ScoredEvaluationExaminationDto();

  private String note;

  public long getVersion() {
    return version;
  }

  public void setVersion(long version) {
    this.version = version;
  }

  public ScoredEvaluationExaminationDto getGrossMotorSkills() {
    return grossMotorSkills;
  }

  public void setGrossMotorSkills(ScoredEvaluationExaminationDto grossMotorSkills) {
    this.grossMotorSkills = grossMotorSkills;
  }

  public ScoredEvaluationExaminationDto getFineMotorSkills() {
    return fineMotorSkills;
  }

  public void setFineMotorSkills(ScoredEvaluationExaminationDto fineMotorSkills) {
    this.fineMotorSkills = fineMotorSkills;
  }

  public HandednessValueDto getHandedness() {
    return handedness;
  }

  public void setHandedness(HandednessValueDto handedness) {
    this.handedness = handedness;
  }

  public ScoredEvaluationExaminationDto getVisualPerceptionResult() {
    return visualPerceptionResult;
  }

  public void setVisualPerceptionResult(ScoredEvaluationExaminationDto visualPerceptionResult) {
    this.visualPerceptionResult = visualPerceptionResult;
  }

  public SopessLanguageDto getLanguage() {
    return language;
  }

  public void setLanguage(SopessLanguageDto language) {
    this.language = language;
  }

  public ArticulationDto getArticulation() {
    return articulation;
  }

  public void setArticulation(ArticulationDto articulation) {
    this.articulation = articulation;
  }

  public SpeechEvaluationExaminationDto getSpeechResult() {
    return speechResult;
  }

  public void setSpeechResult(SpeechEvaluationExaminationDto speechResult) {
    this.speechResult = speechResult;
  }

  public ScoredEvaluationExaminationDto getAuditiveProcessingResult() {
    return auditiveProcessingResult;
  }

  public void setAuditiveProcessingResult(ScoredEvaluationExaminationDto auditiveProcessingResult) {
    this.auditiveProcessingResult = auditiveProcessingResult;
  }

  public KnowledgeThinkingExaminationDto getKnowledgeThinkingResult() {
    return knowledgeThinkingResult;
  }

  public void setKnowledgeThinkingResult(KnowledgeThinkingExaminationDto knowledgeThinkingResult) {
    this.knowledgeThinkingResult = knowledgeThinkingResult;
  }

  public ScoredEvaluationExaminationDto getPsychologicalBehaviorResult() {
    return psychologicalBehaviorResult;
  }

  public void setPsychologicalBehaviorResult(
      ScoredEvaluationExaminationDto psychologicalBehaviorResult) {
    this.psychologicalBehaviorResult = psychologicalBehaviorResult;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
