/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { ApiConcern } from "@eshg/sti-protection-api";
import {
  AccessTimeOutlined,
  DateRange,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { formatDate } from "date-fns";
import { Formik } from "formik";
import { PropsWithChildren } from "react";

import { Row } from "@/lib/businessModules/measlesProtection/shared/components/Row";
import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/StepContext";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";
import { StepButtons } from "./StepButtons";

export function StepLayout({ children }: PropsWithChildren) {
  const [formData, updateFormData] = useFormData<AppointmentFormData>();
  const { goForward } = useStepContext();

  function handleSubmit(values: AppointmentFormData) {
    updateFormData(values);
    goForward();
  }

  return (
    <>
      <BookAppointmentTitle />
      <Formik
        enableReinitialize
        initialValues={formData}
        onSubmit={handleSubmit}
      >
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
                    <StepButtons />
                  </Box>
                </Stack>
              </Sheet>
            }
            sidePanel={<AppointmentOverview />}
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

function AppointmentOverview() {
  const { t } = useTranslation("stiProtection/forms");
  const [{ concern, appointment, date }] = useFormData<AppointmentFormData>();
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
        <Typography level="h2">Termin Übersicht</Typography>
        <Stack gap={2}>
          <Row>
            <MedicalServicesOutlined /> {concernLabel}
          </Row>
          {date != null ? (
            <Row>
              <DateRange /> {formatDate(date, "EEEE, d. MMMM y")}
            </Row>
          ) : null}
          {appointment != null ? (
            <Row>
              <AccessTimeOutlined />{" "}
              {appointment.start.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Row>
          ) : null}
        </Stack>
        <StepButtons />
      </Stack>
    </Sheet>
  );
}
