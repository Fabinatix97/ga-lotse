/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiScoredEvaluationExamination,
  UpdateSopessExaminationResultRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { useSuspenseQueries } from "@tanstack/react-query";

import { SchoolEntryProcedurePageProps } from "@/app/(businessModules)/school-entry/procedures/[procedureId]/layout";
import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { SopessExaminationResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/SopessExaminationResult";
import { useUpdateSopessExaminationResultOptions } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import {
  getProcedureQuery,
  getSopessExaminationResultQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import {
  ArticulationValues,
  KnowledgeThinkingValues,
  LanguageValues,
  ScoredEvaluationExaminationValues,
  SopessExaminationForm,
  SopessExaminationFormValues,
  SpeechValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationForm";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { ContentPanelTitle } from "@/lib/shared/components/contentPanel/ContentPanelTitle";

export default function SchoolEntrySopessExaminationPage(
  props: SchoolEntryProcedurePageProps,
) {
  const procedureId = props.params.procedureId;
  const schoolEntryApi = useSchoolEntryApi();
  const [{ data: procedure }, { data: sopessExaminationResult }] =
    useSuspenseQueries({
      queries: [
        getProcedureQuery(schoolEntryApi, procedureId),
        getSopessExaminationResultQuery(schoolEntryApi, procedureId),
      ],
    });
  const updateSopessExaminationResultOptions =
    useUpdateSopessExaminationResultOptions();
  const updateSopessExaminationResult = useHandledMutation(
    updateSopessExaminationResultOptions,
  );

  async function handleSubmit(formValues: SopessExaminationFormValues) {
    await updateSopessExaminationResult.mutateAsync(
      mapToRequest(procedureId, formValues, sopessExaminationResult.version),
    );
  }

  return (
    <ContentPanel dense>
      <ContentPanelTitle>S1 - SOPESS 2019</ContentPanelTitle>
      <DisabledFormProvider disabled={procedure.isClosed}>
        <SopessExaminationForm
          initialValues={mapToFormValues(sopessExaminationResult)}
          onSubmit={handleSubmit}
          valuesToMutationBundle={(values) => ({
            mutationOptions: updateSopessExaminationResultOptions,
            variableSupplier: () =>
              mapToRequest(
                procedureId,
                values,
                sopessExaminationResult.version,
              ),
          })}
        />
      </DisabledFormProvider>
    </ContentPanel>
  );
}

function mapToFormValues(
  sopessExaminationResult: SopessExaminationResult,
): SopessExaminationFormValues {
  return {
    grossMotorSkills: parseScoredEvaluationExamination(
      sopessExaminationResult.grossMotorSkills,
    ),
    fineMotorSkills: parseScoredEvaluationExamination(
      sopessExaminationResult.fineMotorSkills,
    ),
    handedness: parseOptionalValue(sopessExaminationResult.handedness),
    visualPerception: parseScoredEvaluationExamination(
      sopessExaminationResult.visualPerceptionResult,
    ),
    language: {
      primaryLanguage: parseOptionalValue(
        sopessExaminationResult.language.primaryLanguage,
      ),
      germanKnowledgePrimaryCarer: parseOptionalValue(
        sopessExaminationResult.language.germanKnowledgePrimaryCarer,
      ),
      familyLanguage: parseOptionalValue(
        sopessExaminationResult.language.familyLanguage,
      ),
      germanKnowledgeChild: parseOptionalValue(
        sopessExaminationResult.language.germanKnowledgeChild,
      ),
    },
    articulation: {
      lettersSAndZPoints: parseOptionalValue(
        sopessExaminationResult.articulation.lettersSAndZPoints,
      ),
      formationSchPoints: parseOptionalValue(
        sopessExaminationResult.articulation.formationSchPoints,
      ),
      lettersTAndDPoints: parseOptionalValue(
        sopessExaminationResult.articulation.lettersTAndDPoints,
      ),
      formationChPoints: parseOptionalValue(
        sopessExaminationResult.articulation.formationChPoints,
      ),
      lettersGAndKPoints: parseOptionalValue(
        sopessExaminationResult.articulation.lettersGAndKPoints,
      ),
      lettersLAndNPoints: parseOptionalValue(
        sopessExaminationResult.articulation.lettersLAndNPoints,
      ),
      letterRPoints: parseOptionalValue(
        sopessExaminationResult.articulation.letterRPoints,
      ),
      letterFAndFormationPfPoints: parseOptionalValue(
        sopessExaminationResult.articulation.letterFAndFormationPfPoints,
      ),
      letterBPoints: parseOptionalValue(
        sopessExaminationResult.articulation.letterBPoints,
      ),
      formationsTrDrKrGrPoints: parseOptionalValue(
        sopessExaminationResult.articulation.formationsTrDrKrGrPoints,
      ),
    },
    speech: {
      prepositionPoints: parseOptionalValue(
        sopessExaminationResult.speechResult.prepositionPoints,
      ),
      pluralPoints: parseOptionalValue(
        sopessExaminationResult.speechResult.pluralPoints,
      ),
      result: parseOptionalValue(
        sopessExaminationResult.speechResult.evaluation.examinationResultValue,
      ),
      doctorLetter: parseOptionalValue(
        sopessExaminationResult.speechResult.evaluation.doctorLetterValue,
      ),
    },
    auditiveProcessing: parseScoredEvaluationExamination(
      sopessExaminationResult.auditiveProcessingResult,
    ),
    knowledgeThinking: {
      countingPoints: parseOptionalValue(
        sopessExaminationResult.knowledgeThinkingResult.countingPoints,
      ),
      quantityKnowledgePoints: parseOptionalValue(
        sopessExaminationResult.knowledgeThinkingResult.quantityKnowledgePoints,
      ),
      result: parseOptionalValue(
        sopessExaminationResult.knowledgeThinkingResult.evaluation
          .examinationResultValue,
      ),
      doctorLetter: parseOptionalValue(
        sopessExaminationResult.knowledgeThinkingResult.evaluation
          .doctorLetterValue,
      ),
    },
    psychologicalBehavior: parseScoredEvaluationExamination(
      sopessExaminationResult.psychologicalBehaviorResult,
    ),
    note: parseOptionalValue(sopessExaminationResult.note),
  };
}

function parseScoredEvaluationExamination(
  scoredEvaluationExamination: ApiScoredEvaluationExamination,
): ScoredEvaluationExaminationValues {
  return {
    points: parseOptionalValue(scoredEvaluationExamination.points),
    result: parseOptionalValue(
      scoredEvaluationExamination.evaluation.examinationResultValue,
    ),
    doctorLetter: parseOptionalValue(
      scoredEvaluationExamination.evaluation.doctorLetterValue,
    ),
  };
}

function mapToRequest(
  procedureId: string,
  formValues: SopessExaminationFormValues,
  version: number,
): UpdateSopessExaminationResultRequest {
  return {
    procedureId,
    apiSopessExaminationResult: {
      version,
      grossMotorSkills: mapScoredEvaluationExaminationValues(
        formValues.grossMotorSkills,
      ),
      fineMotorSkills: mapScoredEvaluationExaminationValues(
        formValues.fineMotorSkills,
      ),
      handedness: mapOptionalValue(formValues.handedness),
      visualPerceptionResult: mapScoredEvaluationExaminationValues(
        formValues.visualPerception,
      ),
      language: mapLanguage(formValues.language),
      articulation: mapArticulation(formValues.articulation),
      speechResult: mapSpeechResult(formValues.speech),
      auditiveProcessingResult: mapScoredEvaluationExaminationValues(
        formValues.auditiveProcessing,
      ),
      knowledgeThinkingResult: mapKnowledgeThinkingResult(
        formValues.knowledgeThinking,
      ),
      psychologicalBehaviorResult: mapScoredEvaluationExaminationValues(
        formValues.psychologicalBehavior,
      ),
      note: mapOptionalValue(formValues.note),
    },
  };
}

function mapScoredEvaluationExaminationValues(
  values: ScoredEvaluationExaminationValues,
) {
  return {
    points: mapOptionalValue(values.points),
    evaluation: {
      examinationResultValue: mapOptionalValue(values.result),
      doctorLetterValue: mapOptionalValue(values.doctorLetter),
    },
  };
}

function mapLanguage(values: LanguageValues) {
  return {
    primaryLanguage: mapOptionalValue(values.primaryLanguage),
    germanKnowledgePrimaryCarer: mapOptionalValue(
      values.germanKnowledgePrimaryCarer,
    ),
    familyLanguage: mapOptionalValue(values.familyLanguage),
    germanKnowledgeChild: mapOptionalValue(values.germanKnowledgeChild),
  };
}

function mapArticulation(values: ArticulationValues) {
  return {
    lettersSAndZPoints: mapOptionalValue(values.lettersSAndZPoints),
    formationSchPoints: mapOptionalValue(values.formationSchPoints),
    lettersTAndDPoints: mapOptionalValue(values.lettersTAndDPoints),
    formationChPoints: mapOptionalValue(values.formationChPoints),
    lettersGAndKPoints: mapOptionalValue(values.lettersGAndKPoints),
    lettersLAndNPoints: mapOptionalValue(values.lettersLAndNPoints),
    letterRPoints: mapOptionalValue(values.letterRPoints),
    letterFAndFormationPfPoints: mapOptionalValue(
      values.letterFAndFormationPfPoints,
    ),
    letterBPoints: mapOptionalValue(values.letterBPoints),
    formationsTrDrKrGrPoints: mapOptionalValue(values.formationsTrDrKrGrPoints),
  };
}

function mapSpeechResult(values: SpeechValues) {
  return {
    prepositionPoints: mapOptionalValue(values.prepositionPoints),
    pluralPoints: mapOptionalValue(values.pluralPoints),
    evaluation: {
      examinationResultValue: mapOptionalValue(values.result),
      doctorLetterValue: mapOptionalValue(values.doctorLetter),
    },
  };
}

function mapKnowledgeThinkingResult(values: KnowledgeThinkingValues) {
  return {
    countingPoints: mapOptionalValue(values.countingPoints),
    quantityKnowledgePoints: mapOptionalValue(values.quantityKnowledgePoints),
    evaluation: {
      examinationResultValue: mapOptionalValue(values.result),
      doctorLetterValue: mapOptionalValue(values.doctorLetter),
    },
  };
}
