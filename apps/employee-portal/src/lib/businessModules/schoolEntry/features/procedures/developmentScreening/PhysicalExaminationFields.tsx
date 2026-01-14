/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import {
  DebouncedTextareaField,
  NestedFormProps,
  SetFieldValueHelper,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import {
  ApiDoctorLetterValue,
  ApiExaminationResultValue,
} from "@eshg/school-entry-api";

import {
  ExaminationWithDiagnosisFieldValues,
  ExaminationWithDiagnosisFields,
  isExaminationResultWithoutDiagnosis,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationWithDiagnosisFields";
import { ClickIcd10CodeHandler } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/Icd10CodeField";
import { SetAllExaminationResultsSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { FIXED_WIDTH_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { REQUIRED_PROCEDURE_PROPERTIES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface PhysicalExaminationFieldsProps extends NestedFormProps {
  values: PhysicalExaminationFieldsValues;
  setFieldValue: SetFieldValueHelper;
  onClickIcd10Code: ClickIcd10CodeHandler;
}

export interface PhysicalExaminationFieldsValues {
  nutritionalCondition: ExaminationWithDiagnosisFieldValues;
  neurology: ExaminationWithDiagnosisFieldValues;
  respiratoryCardiovascular: ExaminationWithDiagnosisFieldValues;
  skin: ExaminationWithDiagnosisFieldValues;
  musculatureSkeleton: ExaminationWithDiagnosisFieldValues;
  metabolism: ExaminationWithDiagnosisFieldValues;
  abdomen: ExaminationWithDiagnosisFieldValues;
  earNoseThroat: ExaminationWithDiagnosisFieldValues;
  note: string;
}

interface ExaminationField {
  name: keyof PhysicalExaminationFieldsValues;
  label: string;
  values: ExaminationWithDiagnosisFieldValues;
}

export function PhysicalExaminationFields(
  props: PhysicalExaminationFieldsProps,
) {
  const fieldName = createFieldNameMapper(props.name);

  const EXAMINATION_FIELD_GROUPS: ExaminationField[][] = [
    [
      {
        name: "nutritionalCondition",
        label:
          REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_NUTRITIONAL_CONDITION_RESULT,
        values: props.values.nutritionalCondition,
      },
      {
        name: "neurology",
        label:
          REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_NEUROLOGY_RESULT,
        values: props.values.neurology,
      },
      {
        name: "respiratoryCardiovascular",
        label:
          REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_RESPIRATORY_CARDIOVASCULAR_RESULT,
        values: props.values.respiratoryCardiovascular,
      },
      {
        name: "skin",
        label: REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_SKIN_RESULT,
        values: props.values.skin,
      },
    ],
    [
      {
        name: "musculatureSkeleton",
        label:
          REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_MUSCULATURE_SKELETON_RESULT,
        values: props.values.musculatureSkeleton,
      },
      {
        name: "metabolism",
        label:
          REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_METABOLISM_RESULT,
        values: props.values.metabolism,
      },
      {
        name: "abdomen",
        label:
          REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_ABDOMEN_RESULT,
        values: props.values.abdomen,
      },
      {
        name: "earNoseThroat",
        label:
          REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_EAR_NOSE_THROAT_RESULT,
        values: props.values.earNoseThroat,
      },
    ],
  ];

  function setAllPhysicalExaminations(newValue: string) {
    EXAMINATION_FIELD_GROUPS.forEach((examinationFields) => {
      examinationFields.forEach((field) => {
        void props.setFieldValue(
          fieldName(`${field.name}.examinationResult.examinationResultValue`),
          newValue,
        );
        if (isExaminationResultWithoutDiagnosis(newValue)) {
          void props.setFieldValue(fieldName(`${field.name}.icd10Codes`), []);
        }
        if (newValue === ApiExaminationResultValue.DoctorLetter) {
          void props.setFieldValue(
            fieldName(`${field.name}.examinationResult.doctorLetterValue`),
            ApiDoctorLetterValue.NoReply,
          );
        } else {
          void props.setFieldValue(
            fieldName(`${field.name}.examinationResult.doctorLetterValue`),
            "",
          );
        }
      });
    });
  }

  return (
    <Stack
      gap={2}
      data-testid="physicalExaminationForm"
      role="group"
      aria-labelledby="koerperliche-untersuchung-label"
    >
      <Typography
        level="title-sm"
        component="h2"
        id="koerperliche-untersuchung-label"
      >
        Körperliche Untersuchung
      </Typography>
      <Stack direction="row" gap={4} alignItems="flex-start" flexWrap="wrap">
        <SetAllExaminationResultsSelect
          label="Alle"
          sx={FIXED_WIDTH_STYLE}
          onChange={setAllPhysicalExaminations}
        />
        <Stack direction="row" gap={4} flexWrap="wrap">
          {EXAMINATION_FIELD_GROUPS.map((examinationFields, index) => (
            <Stack key={index} gap={1}>
              {examinationFields.map((field) => (
                <ExaminationWithDiagnosisFields
                  key={field.name}
                  name={fieldName(field.name)}
                  values={field.values}
                  examinationResultLabel={field.label}
                  setFieldValue={props.setFieldValue}
                  onClickIcd10Code={props.onClickIcd10Code}
                />
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>
      <DebouncedTextareaField name={fieldName("note")} label="Bemerkung" />
    </Stack>
  );
}
