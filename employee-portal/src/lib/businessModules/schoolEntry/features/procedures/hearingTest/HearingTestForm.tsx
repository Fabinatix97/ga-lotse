/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDecibelValue,
  ApiHertzValue,
  UpdateHearingTestResultRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import { FormProps, OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { MutationBundle } from "@eshg/lib-portal/types/query";
import { Divider, Grid } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";

import {
  ExaminationResultFields,
  ExaminationResultFieldsValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationResultFields";
import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { EarForm } from "@/lib/businessModules/schoolEntry/features/procedures/hearingTest/EarForm";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";
import { FormStack } from "@/lib/shared/components/form/FormStack";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

type EarValues = Record<ApiHertzValue, OptionalFieldValue<ApiDecibelValue>>;

export interface HearingTestFormValues {
  leftEar: EarValues;
  rightEar: EarValues;
  examinationResult: ExaminationResultFieldsValues;
  note: string;
}

interface HearingTestFormProps extends FormProps<HearingTestFormValues> {
  valuesToMutationBundle: (
    values: HearingTestFormValues,
  ) => MutationBundle<UpdateHearingTestResultRequest>;
}

export function HearingTestForm(props: HearingTestFormProps) {
  async function handleSubmit(
    formValues: HearingTestFormValues,
    helpers: FormikHelpers<HearingTestFormValues>,
  ) {
    await props.onSubmit(formValues);
    helpers.resetForm({ values: formValues });
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
              <EarForm
                name="leftEar"
                sideIndicator="L"
                sideIndicatorPosition={{ xs: "center", xxl: "left" }}
              />
            </Grid>
            <Grid xs={6}>
              <EarForm
                name="rightEar"
                sideIndicator="R"
                sideIndicatorPosition="center"
              />
            </Grid>
          </FormGroupGrid>
          <Divider />
          <FormGroupGrid columns={{ xs: 6, xl: 12 }}>
            <Grid xs={6}>
              <ExaminationResultFields
                name="examinationResult"
                examinationResultLabel="Hörscreening"
                values={values.examinationResult}
                setFieldValue={setFieldValue}
              />
            </Grid>
          </FormGroupGrid>
          <Divider />
          <FormGroupGrid>
            <Grid xs={12}>
              <TextareaField name="note" label="Bemerkung" />
            </Grid>
          </FormGroupGrid>
          <FormFooter isSubmitting={isSubmitting} />
        </FormStack>
      )}
    </Formik>
  );
}
