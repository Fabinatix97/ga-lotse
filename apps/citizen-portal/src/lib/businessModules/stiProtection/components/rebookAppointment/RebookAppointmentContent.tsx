/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

import { ApiAppointment } from "@eshg/sti-protection-api";

import { AppointmentPickerSection } from "@/lib/shared/components/AppointmentPickerSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

import { RebookAppointmentFormValues } from "./RebookAppointmentPage";

interface RebookAppointmentProps {
  appointments: ApiAppointment[];
}

export function RebookAppointmentContent({
  appointments,
}: Readonly<RebookAppointmentProps>) {
  const { t } = useTranslation(["stiProtection/rebookAppointment"]);
  const { setValues } = useFormikContext<RebookAppointmentFormValues>();

  return (
    <ContentSheet data-testid="appointment-slot-form">
      <ContentSheetTitle>{t("time_slot.title")}</ContentSheetTitle>
      <Typography sx={{ alignSelf: "end" }}>
        {t("common.required_title")}
      </Typography>
      <AppointmentPickerSection
        appointments={appointments}
        name="appointment"
        t={t}
        onDateSelected={(value) =>
          setValues({
            date: value,
            appointment: undefined,
          })
        }
        onAppointmentSelected={(value) =>
          setValues({ date: value.start, appointment: value })
        }
      />
    </ContentSheet>
  );
}
