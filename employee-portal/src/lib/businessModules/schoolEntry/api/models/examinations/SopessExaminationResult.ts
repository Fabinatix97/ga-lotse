/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Versioned,
  mapVersioned,
} from "@eshg/lib-employee-portal/api/models/Versioned";
import {
  ApiArticulation,
  ApiHandednessValue,
  ApiKnowledgeThinkingExamination,
  ApiLanguage,
  ApiScoredEvaluationExamination,
  ApiSopessExaminationResult,
  ApiSpeechEvaluationExamination,
} from "@eshg/school-entry-api";

export interface SopessExaminationResult extends Versioned {
  grossMotorSkills: ApiScoredEvaluationExamination;
  fineMotorSkills: ApiScoredEvaluationExamination;
  handedness?: ApiHandednessValue;
  visualPerceptionResult: ApiScoredEvaluationExamination;
  language: ApiLanguage;
  articulation: ApiArticulation;
  speechResult: ApiSpeechEvaluationExamination;
  auditiveProcessingResult: ApiScoredEvaluationExamination;
  knowledgeThinkingResult: ApiKnowledgeThinkingExamination;
  psychologicalBehaviorResult: ApiScoredEvaluationExamination;
  note?: string;
}

export function mapSopessExaminationResult(
  response: ApiSopessExaminationResult,
): SopessExaminationResult {
  return {
    ...mapVersioned(response),
    grossMotorSkills: response.grossMotorSkills,
    fineMotorSkills: response.fineMotorSkills,
    handedness: response.handedness,
    visualPerceptionResult: response.visualPerceptionResult,
    language: response.language,
    articulation: response.articulation,
    speechResult: response.speechResult,
    auditiveProcessingResult: response.auditiveProcessingResult,
    knowledgeThinkingResult: response.knowledgeThinkingResult,
    psychologicalBehaviorResult: response.psychologicalBehaviorResult,
    note: response.note,
  };
}
