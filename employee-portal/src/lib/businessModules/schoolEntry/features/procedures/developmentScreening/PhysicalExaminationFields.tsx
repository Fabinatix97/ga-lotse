/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import {
  NestedFormProps,
  SetFieldValueHelper,
  TextareaField,
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
        label: "Ernährungszustand",
        values: props.values.nutritionalCondition,
      },
      {
        name: "neurology",
        label: "Neurologie",
        values: props.values.neurology,
      },
      {
        name: "respiratoryCardiovascular",
        label: "Atmung-Herz-Kreislauf",
        values: props.values.respiratoryCardiovascular,
      },
      { name: "skin", label: "Haut", values: props.values.skin },
    ],
    [
      {
        name: "musculatureSkeleton",
        label: "Muskulatur, Skelett",
        values: props.values.musculatureSkeleton,
      },
      {
        name: "metabolism",
        label: "Endo/Stoffw.",
        values: props.values.metabolism,
      },
      {
        name: "abdomen",
        label: "Abdomen",
        values: props.values.abdomen,
      },
      {
        name: "earNoseThroat",
        label: "HNO",
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
    <Stack gap={2} data-testid="physicalExaminationForm">
      <Typography level="title-sm">Körperliche Untersuchung</Typography>
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
      <TextareaField name={fieldName("note")} label="Bemerkung" />
    </Stack>
  );
}
