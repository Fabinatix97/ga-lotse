/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { Formik, FormikHelpers, FormikValues } from "formik";
import { RefObject } from "react";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useIsMobile } from "@eshg/lib-portal/hooks/theme";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { theme } from "@/lib/baseModule/theme/theme";
import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageTitle } from "@/lib/shared/components/layout/page";

interface MultiStepFormProps extends RequiresChildren, MultiStepFormTitleProps {
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

interface MultiStepFormTitleProps extends StepCounterProps {
  title: string;
  withLogoutButton: boolean;
  titleRef?: RefObject<HTMLDivElement | null>;
}

export function StepCounter(props: Readonly<StepCounterProps>) {
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
  titleRef,
}: Readonly<MultiStepFormTitleProps>) {
  const isMobile = useIsMobile();
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  return (
    <PageTitle
      titleRef={titleRef}
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
