/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { styled } from "@mui/joy";
import { FormikProps, FormikProvider } from "formik";
import { ReactNode } from "react";

import { ExaminationFormValues } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

const FullHeightFormPlus = styled(FormPlus)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export interface ParticipantExaminationFormProps extends RequiresChildren {
  form: FormikProps<ExaminationFormValues>;
  bottomBar: ReactNode;
}

export function ParticipantExaminationForm(
  props: ParticipantExaminationFormProps,
) {
  return (
    <FormikProvider value={props.form}>
      <FullHeightFormPlus>
        <MainContentLayout fullViewportHeight>
          {props.children}
        </MainContentLayout>
        {props.bottomBar}
      </FullHeightFormPlus>
    </FormikProvider>
  );
}
