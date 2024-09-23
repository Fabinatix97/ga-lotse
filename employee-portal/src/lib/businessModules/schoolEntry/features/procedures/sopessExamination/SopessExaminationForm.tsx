/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiArticulationValue,
  ApiDoctorLetterValue,
  ApiFamilyLanguageValue,
  ApiGermanKnowledgeValue,
  ApiHandednessValue,
  ApiLanguageKnowledgeValue,
  ApiPrimaryLanguageValue,
  ApiSopessExaminationResultValue,
} from "@eshg/employee-portal-api/schoolEntry";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { FormProps, OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";

import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { ArticulationForm } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/ArticulationForm";
import { CountingForm } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/CountingForm";
import { HandednessForm } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/HandednessForm";
import { LanguageForm } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/LanguageForm";
import { SelectiveAttentionForm } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SelectiveAttentionForm";
import { VisuoMotorSkillsForm } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/VisuoMotorSkillsForm";
import { EVALUATION_EXAMINATION_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { FormStack } from "@/lib/shared/components/form/FormStack";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { isInteger } from "@/lib/shared/helpers/guards";

import { BodyCoordinationForm } from "./BodyCoordinationForm";
import { PluralForm } from "./PluralForm";
import { PrepositionForm } from "./PrepositionForm";
import { PseudowordForm } from "./PseudowordForm";
import { QuantityKnowledgeForm } from "./QuantityKnowledgeForm";
import { VisualPerceptionForm } from "./VisualPerceptionForm";

export interface SopessExaminationFormValues {
  grossMotorSkills: ScoredEvaluationExaminationValues;
  fineMotorSkills: ScoredEvaluationExaminationValues;
  handedness: OptionalFieldValue<ApiHandednessValue>;
  visualPerception: ScoredEvaluationExaminationValues;
  language: LanguageValues;
  articulation: ArticulationValues;
  speech: SpeechValues;
  auditiveProcessing: ScoredEvaluationExaminationValues;
  knowledgeThinking: KnowledgeThinkingValues;
  psychologicalBehavior: ScoredEvaluationExaminationValues;
  note: OptionalFieldValue<string>;
}

export interface ScoredEvaluationExaminationValues {
  points: OptionalFieldValue<number>;
  result: OptionalFieldValue<ApiSopessExaminationResultValue>;
  doctorLetter: OptionalFieldValue<ApiDoctorLetterValue>;
}

export interface LanguageValues {
  primaryLanguage: OptionalFieldValue<ApiPrimaryLanguageValue>;
  germanKnowledgePrimaryCarer: OptionalFieldValue<ApiLanguageKnowledgeValue>;
  familyLanguage: OptionalFieldValue<ApiFamilyLanguageValue>;
  germanKnowledgeChild: OptionalFieldValue<ApiGermanKnowledgeValue>;
}

export interface ArticulationValues {
  lettersSAndZPoints: OptionalFieldValue<ApiArticulationValue>;
  formationSchPoints: OptionalFieldValue<ApiArticulationValue>;
  lettersTAndDPoints: OptionalFieldValue<ApiArticulationValue>;
  formationChPoints: OptionalFieldValue<ApiArticulationValue>;
  lettersGAndKPoints: OptionalFieldValue<ApiArticulationValue>;
  lettersLAndNPoints: OptionalFieldValue<ApiArticulationValue>;
  letterRPoints: OptionalFieldValue<ApiArticulationValue>;
  letterFAndFormationPfPoints: OptionalFieldValue<ApiArticulationValue>;
  letterBPoints: OptionalFieldValue<ApiArticulationValue>;
  formationsTrDrKrGrPoints: OptionalFieldValue<ApiArticulationValue>;
}

export interface SpeechValues {
  prepositionPoints: OptionalFieldValue<number>;
  pluralPoints: OptionalFieldValue<number>;
  result: OptionalFieldValue<ApiSopessExaminationResultValue>;
  doctorLetter: OptionalFieldValue<ApiDoctorLetterValue>;
}

export interface KnowledgeThinkingValues {
  countingPoints: OptionalFieldValue<number>;
  quantityKnowledgePoints: OptionalFieldValue<number>;
  result: OptionalFieldValue<ApiSopessExaminationResultValue>;
  doctorLetter: OptionalFieldValue<ApiDoctorLetterValue>;
}

export function mapExaminationEvaluationToExaminationResultValue(
  value: string,
) {
  if (isEmptyString(value)) {
    return "";
  }

  switch (value) {
    case EVALUATION_EXAMINATION_TYPES.CONSPICUOUS:
      return ApiSopessExaminationResultValue.DoctorLetter;
    case EVALUATION_EXAMINATION_TYPES.BORDERLINE:
      return ApiSopessExaminationResultValue.Borderline;
    case EVALUATION_EXAMINATION_TYPES.INCONSPICUOUS:
      return ApiSopessExaminationResultValue.Ok;
    case EVALUATION_EXAMINATION_TYPES.UNKNOWN:
      return ApiSopessExaminationResultValue.Unknown;
  }
}

export function validateValue(
  value: OptionalFieldValue<number>,
  maxValue: number,
  undefinedValue: number,
) {
  if (isEmptyString(value)) {
    return undefined;
  }
  if (
    !(
      isInteger(value) &&
      ((value >= 0 && value <= maxValue) || value === undefinedValue)
    )
  ) {
    return "Ungültiger Wert";
  }
}

export const MIN_0 = 0;
export const MAX_9 = 9;
export const MAX_99 = 99;

export function SopessExaminationForm(
  props: FormProps<SopessExaminationFormValues>,
) {
  async function handleSubmit(
    formValues: SopessExaminationFormValues,
    helpers: FormikHelpers<SopessExaminationFormValues>,
  ) {
    await props.onSubmit(formValues);
    helpers.resetForm({ values: formValues });
  }

  return (
    <Formik initialValues={props.initialValues} onSubmit={handleSubmit}>
      {({ values, isSubmitting, handleSubmit, setFieldValue }) => (
        <FormStack dense onSubmit={handleSubmit}>
          <ConfirmLeaveDirtyFormEffect />
          <Stack
            gap={5}
            direction="row"
            alignItems="flex-end"
            flexWrap="wrap"
            divider={<Divider orientation="vertical" />}
          >
            <BodyCoordinationForm
              points={values.grossMotorSkills.points}
              result={values.grossMotorSkills.result}
              setFieldValue={setFieldValue}
            />
            <VisuoMotorSkillsForm
              points={values.fineMotorSkills.points}
              result={values.fineMotorSkills.result}
              setFieldValue={setFieldValue}
            />
            <HandednessForm />
          </Stack>
          <Divider />
          <Stack>
            <VisualPerceptionForm
              points={values.visualPerception.points}
              result={values.visualPerception.result}
              setFieldValue={setFieldValue}
            />
          </Stack>
          <Divider />
          <LanguageForm values={values.language} />
          <ArticulationForm
            lettersSAndZPoints={values.articulation.lettersSAndZPoints}
            formationSchPoints={values.articulation.formationSchPoints}
            lettersTAndDPoints={values.articulation.lettersTAndDPoints}
            formationChPoints={values.articulation.formationChPoints}
            lettersGAndKPoints={values.articulation.lettersGAndKPoints}
            lettersLAndNPoints={values.articulation.lettersLAndNPoints}
            letterRPoints={values.articulation.letterRPoints}
            letterFAndFormationPfPoints={
              values.articulation.letterFAndFormationPfPoints
            }
            letterBPoints={values.articulation.letterBPoints}
            formationsTrDrKrGrPoints={
              values.articulation.formationsTrDrKrGrPoints
            }
            setFieldValue={setFieldValue}
          ></ArticulationForm>
          <Stack gap={5} direction="row" alignItems="flex-end" flexWrap="wrap">
            <PrepositionForm
              prepositionPoints={values.speech.prepositionPoints}
            />
            <PluralForm
              pluralPoints={values.speech.pluralPoints}
              result={values.speech.result}
              setFieldValue={setFieldValue}
            />
          </Stack>
          <Divider />
          <Stack>
            <PseudowordForm
              points={values.auditiveProcessing.points}
              result={values.auditiveProcessing.result}
              setFieldValue={setFieldValue}
            />
          </Stack>
          <Divider />
          <Stack gap={5} direction="row" alignItems="center" flexWrap="wrap">
            <CountingForm
              countingPoints={values.knowledgeThinking.countingPoints}
            />
            <QuantityKnowledgeForm
              quantityKnowledgePoints={
                values.knowledgeThinking.quantityKnowledgePoints
              }
              result={values.knowledgeThinking.result}
              setFieldValue={setFieldValue}
            />
            <Divider orientation="vertical" />
            <SelectiveAttentionForm
              points={values.psychologicalBehavior.points}
              result={values.psychologicalBehavior.result}
              setFieldValue={setFieldValue}
            />
          </Stack>
          <TextareaField name="note" label="Bemerkung" />
          <FormFooter isSubmitting={isSubmitting} />
        </FormStack>
      )}
    </Formik>
  );
}
