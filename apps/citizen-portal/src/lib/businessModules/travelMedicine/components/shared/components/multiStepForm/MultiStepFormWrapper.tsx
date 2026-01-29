/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { Formik, FormikHelpers, FormikValues } from "formik";
import { useId } from "react";

import {
  FormPlus,
  RequiresChildren,
  useIsMobile,
  useUpdateDocumentTitle,
} from "@eshg/lib-portal";

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
  const titleId = useId();
  const stepperTitleId = useId();
  return (
    <Formik initialValues={props.initialValues} onSubmit={props.onSubmit}>
      <Stack gap={2}>
        <MultiStepFormTitle
          title={props.title}
          titleId={titleId}
          stepperTitleId={stepperTitleId}
          stepperTitle={props.stepperTitle}
          withLogoutButton={props.withLogoutButton}
        />
        <FormPlus
          autoFocus
          aria-labelledby={titleId}
          aria-describedby={stepperTitleId}
        >
          {props.children}
        </FormPlus>
      </Stack>
    </Formik>
  );
}

interface StepCounterProps {
  stepperTitle: string;
  stepperTitleId?: string;
}

interface MultiStepFormTitleProps extends StepCounterProps {
  title: string;
  withLogoutButton: boolean;
  titleId?: string;
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
      id={props.stepperTitleId}
    >
      {props.stepperTitle}
    </Typography>
  );
}

export function MultiStepFormTitle({
  title,
  stepperTitle,
  stepperTitleId,
  withLogoutButton,
  titleId,
}: Readonly<MultiStepFormTitleProps>) {
  const isMobile = useIsMobile();
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  useUpdateDocumentTitle(`${stepperTitle} - ${title}`);

  return (
    <PageTitle
      titleId={titleId}
      toolbar={
        <>
          {!isMobile && <StepCounter stepperTitle={stepperTitle} />}
          {withLogoutButton && <LogoutButton text={t("header.logout")} />}
        </>
      }
    >
      <Stack gap={0.5}>
        {title}
        {isMobile && (
          <StepCounter
            stepperTitleId={stepperTitleId}
            stepperTitle={stepperTitle}
          />
        )}
      </Stack>
    </PageTitle>
  );
}
