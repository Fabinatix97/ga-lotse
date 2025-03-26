/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { TextareaField } from "@eshg/lib-employee-portal";
import {
  FormProps,
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { MutationBundle } from "@eshg/lib-portal/types/query";
import {
  ApiDoctorLetterValue,
  ApiEyeExaminationType,
  ApiPercentageValue,
  UpdateEyeExaminationResultRequest,
} from "@eshg/school-entry-api";
import { Divider, Grid, Stack } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";

import {
  ExaminationResultFields,
  ExaminationResultFieldsValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationResultFields";
import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { SetAllExaminationResultsSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { handleChangeExaminationResultValue } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { EyeForm } from "@/lib/businessModules/schoolEntry/features/procedures/eyeExamination/EyeForm";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";
import { FormStack } from "@/lib/shared/components/form/FormStack";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

const CHECKBOX_GROUPS: CheckboxDefinition[][] = [
  [
    { name: "hyperopia", label: "Hyperopie" },
    { name: "amblyopia", label: "Amblyopie" },
    { name: "myopia", label: "Myopie" },
  ],
  [
    { name: "strabismus", label: "Strabismus" },
    { name: "colorVisionDisorder", label: "Farbsinnstörung" },
    { name: "astigmatism", label: "Astigmatismus" },
  ],
  [{ name: "otherDiagnosis", label: "And. Diagnose" }],
];

function resetCheckboxes(setFieldValue: SetFieldValueHelper) {
  CHECKBOX_GROUPS.forEach((checkboxes) =>
    checkboxes.forEach((checkbox) => {
      void setFieldValue(checkbox.name, false);
    }),
  );
}

const examinationFields = [
  "eyeExamination.examinationResultValue",
  "ishiharaExamination.examinationResultValue",
  "langExamination.examinationResultValue",
];

interface CheckboxDefinition {
  name: string;
  label: string;
}

type EyeValues = Record<
  ApiEyeExaminationType,
  OptionalFieldValue<ApiPercentageValue>
>;

export interface EyeExaminationFormValues {
  leftEye: EyeValues;
  rightEye: EyeValues;
  eyeExamination: ExaminationResultFieldsValues;
  ishiharaExamination: ExaminationResultFieldsValues;
  langExamination: ExaminationResultFieldsValues;
  amblyopia: boolean;
  astigmatism: boolean;
  colorVisionDisorder: boolean;
  hyperopia: boolean;
  myopia: boolean;
  otherDiagnosis: boolean;
  strabismus: boolean;
  note: string;
}

interface EyeExaminationFormProps extends FormProps<EyeExaminationFormValues> {
  valuesToMutationBundle: (
    values: EyeExaminationFormValues,
  ) => MutationBundle<UpdateEyeExaminationResultRequest>;
}

export function EyeExaminationForm(props: EyeExaminationFormProps) {
  async function handleSubmit(
    formValues: EyeExaminationFormValues,
    helpers: FormikHelpers<EyeExaminationFormValues>,
  ) {
    await props.onSubmit(formValues);
    helpers.resetForm({ values: formValues });
  }

  function setAllExaminationFields(
    value: string,
    setFieldValue: SetFieldValueHelper,
  ) {
    examinationFields.forEach((field) => {
      void setFieldValue(field, value);
    });
    handleChangeExaminationResultValue(
      value,
      "eyeExamination",
      setFieldValue,
      () => resetCheckboxes(setFieldValue),
    );
    handleChangeExaminationResultValue(
      value,
      "ishiharaExamination",
      setFieldValue,
    );
    handleChangeExaminationResultValue(value, "langExamination", setFieldValue);
  }

  return (
    <Formik initialValues={props.initialValues} onSubmit={handleSubmit}>
      {({ values, isSubmitting, handleSubmit, setFieldValue }) => (
        <FormStack onSubmit={handleSubmit}>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={props.valuesToMutationBundle(values)}
          />
          <FormGroupGrid columns={{ xs: 6, xxl: 12 }}>
            <Grid xs={6}>
              <EyeForm
                name="leftEye"
                sideIndicator="L"
                sideIndicatorPosition={{ xs: "center", xxl: "left" }}
              />
            </Grid>
            <Grid xs={6}>
              <EyeForm
                name="rightEye"
                sideIndicator="R"
                sideIndicatorPosition="center"
              />
            </Grid>
          </FormGroupGrid>
          <Divider />
          <Grid container columnSpacing={{ xs: 3, xxl: 5 }} rowSpacing={5}>
            <Grid xs={6} xxl={2} spacing={3}>
              <SetAllExaminationResultsSelect
                label="Alle"
                onChange={(value) =>
                  setAllExaminationFields(value, setFieldValue)
                }
                orientation="vertical"
              />
            </Grid>
            <Grid xs={12} xxl={5}>
              <Stack gap={2} direction="column">
                <ExaminationResultFields
                  examinationResultLabel="Sehscreening"
                  name="eyeExamination"
                  values={values.eyeExamination}
                  setFieldValue={setFieldValue}
                  onResetResponse={() => resetCheckboxes(setFieldValue)}
                />
                <Stack gap={3} direction="row">
                  {CHECKBOX_GROUPS.map((checkboxes, index) => (
                    <Stack gap={3} key={index}>
                      {checkboxes.map(({ name, label }) => (
                        <CheckboxField
                          key={name}
                          name={name}
                          label={label}
                          disabled={
                            values.eyeExamination.doctorLetterValue !==
                              ApiDoctorLetterValue.Confirmed &&
                            values.eyeExamination.doctorLetterValue !==
                              ApiDoctorLetterValue.PartiallyConfirmed
                          }
                        />
                      ))}
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={12} xxl={5}>
              <Stack gap={2} direction="column">
                <ExaminationResultFields
                  examinationResultLabel="Lang-Test"
                  name="langExamination"
                  values={values.langExamination}
                  setFieldValue={setFieldValue}
                />
                <ExaminationResultFields
                  examinationResultLabel="Ishihara"
                  name="ishiharaExamination"
                  values={values.ishiharaExamination}
                  setFieldValue={setFieldValue}
                />
              </Stack>
            </Grid>
          </Grid>
          <Divider />
          <TextareaField name="note" label="Bemerkung" />
          <FormFooter isSubmitting={isSubmitting} />
        </FormStack>
      )}
    </Formik>
  );
}
