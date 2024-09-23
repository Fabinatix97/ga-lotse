/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack, Typography } from "@mui/joy";
import { Formik, FormikHelpers, FormikValues } from "formik";

import { theme } from "@/lib/baseModule/theme/theme";
import { PageTitle } from "@/lib/shared/components/layout/page";

export interface MultiStepFormProps
  extends RequiresChildren,
    MultiStepFormTitleProps {
  initialValues: FormikValues;
  onSubmit: (
    values: FormikValues,
    resetForm: FormikHelpers<FormikValues>,
  ) => Promise<void>;
}

export function MultiStepFormWrapper(props: MultiStepFormProps) {
  return (
    <Formik initialValues={props.initialValues} onSubmit={props.onSubmit}>
      <Stack gap={2}>
        <MultiStepFormTitle
          title={props.title}
          stepperTitle={props.stepperTitle}
        />
        <FormPlus>{props.children}</FormPlus>
      </Stack>
    </Formik>
  );
}

interface StepCounterProps {
  stepperTitle: string;
}

export interface MultiStepFormTitleProps extends StepCounterProps {
  title: string;
}

function StepCounter(props: StepCounterProps) {
  return (
    <Typography
      level="h4"
      sx={{
        color: theme.palette.text.tertiary,
        fontWeight: "600",
      }}
      data-testid="step-counter"
    >
      {props.stepperTitle}
    </Typography>
  );
}

export function MultiStepFormTitle({
  title,
  stepperTitle,
}: MultiStepFormTitleProps) {
  return (
    <PageTitle toolbar={<StepCounter stepperTitle={stepperTitle} />}>
      {title}
    </PageTitle>
  );
}
