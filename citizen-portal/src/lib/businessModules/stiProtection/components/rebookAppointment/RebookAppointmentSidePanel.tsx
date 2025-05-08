/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  AccessTimeOutlined,
  DateRange,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { formatDate } from "date-fns";
import { useFormikContext } from "formik";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { ApiConcern } from "@eshg/sti-protection-api";

import { useConcernedCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/lib/i18n/useLocale";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

import { RebookAppointmentFormValues } from "./RebookAppointmentPage";

export function RebookAppointmentSidePanel({
  concern,
}: {
  concern: ApiConcern;
}) {
  const locale = useLocale();
  const { t } = useTranslation(["stiProtection/rebookAppointment"]);
  const concernTitleTranslationKey =
    concern === ApiConcern.HivStiConsultation
      ? "hiv_sti_consultation"
      : "sex_work";
  const accessCode = useAccessCodeParam();
  const citizenRoutes = useConcernedCitizenRoutes(concern);

  const { values, handleSubmit } =
    useFormikContext<RebookAppointmentFormValues>();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("common.overview_title")}</ContentSheetTitle>
      <Stack gap={1} data-testid="appointment-summary">
        <DetailsItem
          label={t("appointment_overview.concern")}
          value={t(`common.${concernTitleTranslationKey}`)}
          icon={<MedicalServicesOutlined />}
          hiddenLabel
        />
        <>
          {values.date && (
            <DetailsItem
              label={t("appointment_overview.date")}
              value={formatDate(values.date, "EEEE, d. MMMM y", { locale })}
              icon={<DateRange />}
              hiddenLabel
            />
          )}
          {values.appointment?.start && (
            <DetailsItem
              label={t("appointment_overview.time")}
              value={
                formatDate(values.appointment.start, "HH:mm", { locale }) +
                t("appointment_overview.clock")
              }
              icon={<AccessTimeOutlined />}
              hiddenLabel
            />
          )}
        </>
      </Stack>
      <Stack gap={2}>
        <Button color="primary" variant="solid" onClick={() => handleSubmit()}>
          {t("appointment_overview.rebook_appointment_button")}
        </Button>
        <InternalLinkButton
          href={citizenRoutes.personalArea.index(accessCode)}
          variant="outlined"
        >
          {t("appointment_overview.cancel_button")}
        </InternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
