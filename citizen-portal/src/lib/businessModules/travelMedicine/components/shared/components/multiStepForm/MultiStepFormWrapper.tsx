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
import { LogoutButton } from "@/lib/businessModules/travelMedicine/components/shared/components/LogoutButton";
import { LogoutButtonWithText } from "@/lib/businessModules/travelMedicine/components/shared/components/LogoutButtonWithText";
import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import { PageTitle } from "@/lib/shared/components/layout/page";

export interface MultiStepFormProps
  extends RequiresChildren,
    MultiStepFormTitleProps {
  initialValues: FormikValues;
  onSubmit: (
    values: FormikValues,
    resetForm: FormikHelpers<FormikValues>,
  ) => Promise<void>;
  withLogoutButton: boolean;
}

export function MultiStepFormWrapper(props: Readonly<MultiStepFormProps>) {
  return (
    <Formik initialValues={props.initialValues} onSubmit={props.onSubmit}>
      <Stack gap={2}>
        <MultiStepFormTitle
          title={props.title}
          stepperTitle={props.stepperTitle}
          withLogoutButton={props.withLogoutButton}
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
  withLogoutButton: boolean;
}

function StepCounter(props: Readonly<StepCounterProps>) {
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
  withLogoutButton,
}: Readonly<MultiStepFormTitleProps>) {
  const isMobile = useIsMobile();

  return (
    <PageTitle
      toolbar={
        <>
          {!isMobile && <StepCounter stepperTitle={stepperTitle} />}
          {withLogoutButton &&
            (isMobile ? <LogoutButton /> : <LogoutButtonWithText />)}
        </>
      }
    >
      <Stack gap={0.5}>
        {title}
        {isMobile && <StepCounter stepperTitle={stepperTitle} />}
      </Stack>
    </PageTitle>
  );
}
