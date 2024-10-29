/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentBookingType } from "@eshg/citizen-portal-api/travelMedicine";
import { Button, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useDeleteAppointmentCp } from "@/lib/businessModules/travelMedicine/api/mutations/citizenAuthApi";
import { useIdContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function AppointmentDetailsSidePanel({
  hasAccomplishedService,
}: Readonly<{
  hasAccomplishedService: boolean;
}>) {
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);
  const { procedureId, procedureStepId, appointmentDetails } = useIdContext();
  const deleteAppointment = useDeleteAppointmentCp();

  async function handleDeleteAppointment() {
    await deleteAppointment.mutateAsync({
      procedureId: procedureId,
      procedureStepId: procedureStepId,
    });
  }

  function navigateToRebookAppointment() {
    const url = `${citizenRoutes.viewAppointment.details.rebook(accessCode)}?procedureId=${procedureId}&procedureStepId=${procedureStepId}`;
    router.push(url);
  }

  function bookingsRemaining() {
    return appointmentDetails.bookingsRemaining > 0;
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
    <ContentSheet>
      <Stack gap={"16px"}>
        {!hasAccomplishedService && (
          <>
            <ContentSheetTitle sx={{ paddingBottom: "8px" }}>
              {t("sidePanel.title")}
            </ContentSheetTitle>
            {bookingsRemaining() && (
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                onClick={navigateToRebookAppointment}
              >
                {isBooked()
                  ? t("sidePanel.postponeAppointment")
                  : t("sidePanel.bookAppointment")}
              </Button>
            )}
            {isBooked() && (
              <Button
                color="danger"
                variant="outlined"
                type="submit"
                onClick={handleDeleteAppointment}
              >
                {t("sidePanel.cancelAppointment")}
              </Button>
            )}
          </>
        )}
        <Button
          color="neutral"
          variant="soft"
          type="submit"
          onClick={() =>
            router.push(citizenRoutes.viewAppointment.index(accessCode))
          }
        >
          {t("sidePanel.back")}
        </Button>
      </Stack>
    </ContentSheet>
  );
}
