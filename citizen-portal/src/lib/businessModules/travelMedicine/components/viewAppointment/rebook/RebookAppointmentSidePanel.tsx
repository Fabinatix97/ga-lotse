/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentBookingType } from "@eshg/citizen-portal-api/travelMedicine";
import { formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatDateToFullReadableString } from "@eshg/lib-portal/helpers/dateTime";
import { AccessTimeOutlined, DateRange } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { DetailsField } from "@/lib/businessModules/travelMedicine/components/shared/components/DetailsField";
import { useIdContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { RebookAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/viewAppointment/rebook/RebookAppointmentPageContent";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
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
  const splitArr = values.selectedAppointment?.split(",");
  const split = splitArr?.at(0);
  const appointmentStart = new Date(split!);
  const durationInMinutes = splitArr?.at(1);

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
      {values.selectedAppointment && (
        <>
          <DetailsField
            value={formatDateToFullReadableString(appointmentStart)}
            icon={<DateRange />}
          />
          <DetailsField
            value={`${formatTime(appointmentStart)} ${t("sidePanel.appointmentDuration", { durationInMinutes: durationInMinutes })}`}
            icon={<AccessTimeOutlined />}
          />
        </>
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
