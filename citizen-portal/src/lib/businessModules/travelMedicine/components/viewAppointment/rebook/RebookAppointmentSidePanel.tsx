/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AccessTimeOutlined, DateRange } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { formatTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  durationBetweenDatesInMinutes,
  formatDateToFullReadableString,
} from "@eshg/lib-portal/helpers/dateTime";
import { ApiAppointmentBookingType } from "@eshg/travel-medicine-api";

import { useIdContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { RebookAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/viewAppointment/rebook/RebookAppointmentPageContent";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function RebookAppointmentSidePanel() {
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const { t } = useTranslation(["travelMedicine/rebookAppointment"]);
  const { procedureId, procedureStepId, appointmentDetails } = useIdContext();
  const { values, handleSubmit } =
    useFormikContext<RebookAppointmentFormValues>();
  const appointmentStart = values.appointment?.start;
  const durationInMinutes =
    values.appointment &&
    durationBetweenDatesInMinutes(
      values.appointment?.start,
      values.appointment?.end,
    );

  function routeBackToDetails() {
    const url = `${citizenRoutes.viewAppointment.details.index(accessCode)}?procedureId=${procedureId}&procedureStepId=${procedureStepId}`;
    router.push(url);
  }

  function isBooked() {
    return (
      appointmentDetails.summaryDto.appointmentBookingType ===
        ApiAppointmentBookingType.AppointmentBlock ||
      appointmentDetails.summaryDto.appointmentBookingType ===
        ApiAppointmentBookingType.UserDefined
    );
  }

  return (
    <ContentSheet data-testid="rebook-appointment-side-panel">
      <ContentSheetTitle>{t("sidePanel.title")}</ContentSheetTitle>
      {appointmentStart && (
        <Stack role="list" gap={1}>
          <DetailsItem
            slotProps={{
              stack: { role: "listitem" },
            }}
            label={t("overview.fields.date", {
              context: "label",
            })}
            value={formatDateToFullReadableString(appointmentStart)}
            icon={<DateRange />}
            hiddenLabel
          />
          <DetailsItem
            slotProps={{
              stack: { role: "listitem" },
            }}
            label={t("overview.fields.time", {
              context: "label",
            })}
            value={`${formatTime(appointmentStart)} ${t("sidePanel.appointmentDuration", { durationInMinutes })}`}
            icon={<AccessTimeOutlined />}
            hiddenLabel
          />
        </Stack>
      )}
      <Stack gap={2}>
        <Button color="primary" variant="solid" onClick={() => handleSubmit()}>
          {isBooked()
            ? t("sidePanel.postponeAppointment")
            : t("sidePanel.bookAppointment")}
        </Button>
        <Button color="neutral" variant="soft" onClick={routeBackToDetails}>
          {t("sidePanel.back")}
        </Button>
      </Stack>
    </ContentSheet>
  );
}
