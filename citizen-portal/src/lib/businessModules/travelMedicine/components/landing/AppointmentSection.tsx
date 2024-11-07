/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function AppointmentSection() {
  const { t } = useTranslation(["travelMedicine/landing"]);
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  function handleBookAppointment() {
    router.push(citizenRoutes.appointment);
  }

  function handleAppointmentLogin() {
    router.push(citizenRoutes.viewAppointment.index(accessCode));
  }

  return (
    <ContentSheet>
      <ContentSheetTitle>
        {t("appointment.bookAppointmentTitle")}
      </ContentSheetTitle>
      <Typography>{t("appointment.bookAppointmentText")}</Typography>
      <Stack direction="column" gap={2}>
        <Button
          type="submit"
          onClick={() => {
            handleBookAppointment();
          }}
        >
          {t("appointment.bookAppointment")}
        </Button>
        <Button
          type="submit"
          variant="outlined"
          onClick={() => {
            handleAppointmentLogin();
          }}
        >
          {t("appointment.myAppointment")}
        </Button>
      </Stack>
    </ContentSheet>
  );
}
