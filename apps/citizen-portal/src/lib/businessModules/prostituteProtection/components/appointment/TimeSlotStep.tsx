/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet } from "@mui/joy";
import { endOfDay, isPast } from "date-fns";

import { useFreeAppointments } from "@/lib/businessModules/prostituteProtection/api/queries/publicCitizenApi";
import { NoAppointments } from "@/lib/businessModules/prostituteProtection/components/appointment/NoAppointments";
import { useCitizenRoutes } from "@/lib/businessModules/prostituteProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { AppointmentPickerSection } from "@/lib/shared/components/AppointmentPickerSection";

import { StepSubTitle } from "./StepSubTitle";

export function TimeSlotStep() {
  const { t } = useTranslation("prostituteProtection/forms");
  const citizenRoutes = useCitizenRoutes();
  const { data: appointments } = useFreeAppointments();
  const filteredAppointments = appointments.appointments.filter(
    (appointment) => !isPast(endOfDay(appointment.start)),
  );

  return (
    <Sheet sx={{ backgroundColor: (theme) => theme.palette.background.body }}>
      <StepSubTitle title={t("time_slot.title")} />
      {filteredAppointments.length ? (
        <AppointmentPickerSection
          appointments={filteredAppointments}
          name="appointment"
          t={t}
        />
      ) : (
        <NoAppointments backButtonLocation={citizenRoutes.overview} />
      )}
    </Sheet>
  );
}
