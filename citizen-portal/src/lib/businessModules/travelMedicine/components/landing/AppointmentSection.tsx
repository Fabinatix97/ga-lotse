/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function AppointmentSection() {
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
      <ContentSheetTitle>Termin vereinbaren?</ContentSheetTitle>
      <Typography>
        Sie haben die Möglichkeit Termine für Impfungen, Folgeimpfungen und
        Beratungsgespräche mit anschließender Impfung zu vereinbaren.
      </Typography>
      <Button
        type="submit"
        onClick={() => {
          handleBookAppointment();
        }}
      >
        Termin buchen
      </Button>
      <Button
        type="submit"
        variant="outlined"
        onClick={() => {
          handleAppointmentLogin();
        }}
      >
        Zu meinen Terminen
      </Button>
    </ContentSheet>
  );
}
