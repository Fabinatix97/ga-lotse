/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { FormikProps, FormikProvider } from "formik";

import { ExaminationFormValues } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";

export interface ParticipantExaminationFormProps extends RequiresChildren {
  form: FormikProps<ExaminationFormValues>;
}

export function ParticipantExaminationForm(
  props: ParticipantExaminationFormProps,
) {
  return (
    <FormikProvider value={props.form}>
      <MainContentLayout fullViewportHeight>
        <FormPlus>{props.children}</FormPlus>
      </MainContentLayout>
    </FormikProvider>
  );
}
