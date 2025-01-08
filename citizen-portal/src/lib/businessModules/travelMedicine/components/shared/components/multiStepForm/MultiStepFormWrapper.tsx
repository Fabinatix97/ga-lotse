/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack, Typography } from "@mui/joy";
import { Formik, FormikHelpers, FormikValues } from "formik";

import { theme } from "@/lib/baseModule/theme/theme";
import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageTitle } from "@/lib/shared/components/layout/page";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

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
      component="span"
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
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  return (
    <PageTitle
      toolbar={
        <>
          {!isMobile && <StepCounter stepperTitle={stepperTitle} />}
          {withLogoutButton && <LogoutButton text={t("header.logout")} />}
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
