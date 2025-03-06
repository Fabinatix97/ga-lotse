/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@eshg/lib-portal/components/Row";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { ApiConcern } from "@eshg/sti-protection-api";
import {
  AccessTimeOutlined,
  CakeOutlined,
  DateRange,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { formatDate } from "date-fns";
import { Formik } from "formik";
import { PropsWithChildren } from "react";

import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/StepContext";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";

import { useFormData } from "./AppointmentDataContext";
import {
  AppointmentFormData,
  FormDataWithoutConcern,
} from "./AppointmentStepper";
import { StepButtons } from "./StepButtons";

type InitialValues<T extends FormDataWithoutConcern> = {
  readonly [K in keyof T]: T[K] | "" | null;
};
export type StepLayoutProps<T extends FormDataWithoutConcern> =
  PropsWithChildren<{
    initialValues: InitialValues<T>;
    submit?: string | undefined;
    onSubmit: (e: T) => Promise<FormDataWithoutConcern | void> | void;
  }>;
export function StepLayout<T extends FormDataWithoutConcern>({
  children,
  initialValues: givenInitialValues,
  submit,
  onSubmit,
}: StepLayoutProps<T>) {
  const [formData, updateFormData] = useFormData<T & AppointmentFormData>();
  const { goForward } = useStepContext();

  async function handleSubmit(values: T) {
    const newValues = await onSubmit(values);
    if (newValues) {
      updateFormData(newValues as T & AppointmentFormData);
      goForward();
    }
  }

  const initialValues = {
    ...givenInitialValues,
    ...formData,
  };

  return (
    <>
      <BookAppointmentTitle />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <FormPlus>
          <TwoColumnGrid
            content={
              <Sheet>
                <Stack gap={3}>
                  {children}
                  <Box
                    sx={(theme) => ({
                      [theme.breakpoints.up("md")]: { display: "none" },
                    })}
                  >
                    <StepButtons submit={submit} />
                  </Box>
                </Stack>
              </Sheet>
            }
            sidePanel={<AppointmentOverview submit={submit} />}
          />
        </FormPlus>
      </Formik>
    </>
  );
}
export function BookAppointmentTitle() {
  const { t } = useTranslation("stiProtection/forms");
  const { currentStepIndex, totalSteps } = useStepContext();
  return (
    <PageTitle>
      <Row justifyContent="space-between">
        {t("common.appointment_booking_title")}
        <Row sx={{ alignContent: "center" }}>
          <Typography
            level="h4"
            sx={{ alignContent: "center" }}
            textColor="text.tertiary"
          >
            {t("common.current_step", {
              currentStep: currentStepIndex + 1,
              totalSteps,
            })}
          </Typography>
        </Row>
      </Row>
    </PageTitle>
  );
}

function AppointmentOverview({ submit }: { submit?: string | undefined }) {
  const { t } = useTranslation("stiProtection/forms");
  const [{ concern, ...data }] = useFormData<AppointmentFormData>();
  const concernLabel =
    concern === ApiConcern.SexWork
      ? t("common.sex_work")
      : t("common.hiv_sti_consultation");
  return (
    <Sheet
      sx={(theme) => ({
        [theme.breakpoints.down("md")]: { display: "none" },
      })}
    >
      <Stack gap={3}>
        <Typography level="h2">{t("common.overview_title")}</Typography>
        <Stack gap={2}>
          <Row sx={{ flexWrap: "nowrap" }}>
            <MedicalServicesOutlined /> {concernLabel}
          </Row>
          {data.date != null ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <DateRange /> {formatDate(data.date, "EEEE, d. MMMM y")}
            </Row>
          ) : null}
          {data.appointment != null ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <AccessTimeOutlined />{" "}
              {data.appointment.start.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Row>
          ) : null}
          {data.birthYear ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <CakeOutlined /> {data.birthYear}
            </Row>
          ) : null}
        </Stack>
        <StepButtons submit={submit} />
      </Stack>
    </Sheet>
  );
}
