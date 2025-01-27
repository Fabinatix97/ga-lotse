/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiOralHygieneStatus } from "@eshg/dental-api";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { FormProps, OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Grid } from "@mui/joy";
import { Formik } from "formik";

import { AdditionalInformation } from "@/lib/businessModules/dental/features/children/details/AdditionalInformation";
import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { FormStack } from "@/lib/shared/components/form/FormStack";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";

export interface ExaminationFormValues {
  screening: boolean;
  fluoridation: boolean;
  note: OptionalFieldValue<string>;
  oralHygieneStatus?: OptionalFieldValue<ApiOralHygieneStatus>;
  fluorideVarnishApplied: OptionalFieldValue<boolean>;
}

export function ExaminationDetails(props: FormProps<ExaminationFormValues>) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <FormStack onSubmit={handleSubmit}>
            <PageGrid>
              <Grid xxs={12} md={4}>
                <AdditionalInformation
                  screening={props.initialValues.screening}
                  fluoridation={props.initialValues.fluoridation}
                />
              </Grid>
              <Grid xxs={12} md={8}>
                <InformationSheet>
                  <InputField type="text" label="Bemerkung" name="note" />
                </InformationSheet>
              </Grid>
            </PageGrid>
            <FormFooter isSubmitting={isSubmitting} />
          </FormStack>
        );
      }}
    </Formik>
  );
}
