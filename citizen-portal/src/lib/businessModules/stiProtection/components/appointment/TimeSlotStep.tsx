/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { isSameAppointment } from "@eshg/lib-portal/components/formFields/appointmentPicker/helpers";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { ApiConcern } from "@eshg/sti-protection-api";
import { DateRangeOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";
import assert from "assert";
import { differenceInMinutes, startOfMonth } from "date-fns";
import { prop, sortBy } from "remeda";

import {
  useBookAppointment,
  useCancelAppointment,
} from "@/lib/businessModules/stiProtection/api/mutations/publicCitizensApi";
import { useFreeAppointments } from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { AppointmentPickerSection } from "@/lib/shared/components/AppointmentPickerSection";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";
import { BookAppointmentTitle, StepLayout } from "./StepLayout";
import { StepSubTitle } from "./StepSubTitle";

interface TimeSlotData {
  appointment: Required<AppointmentFormData["appointment"]>;
  date: AppointmentFormData["date"];
}
const initialValues = {
  appointment: null,
  date: null,
};

export function TimeSlotStep() {
  const { t } = useTranslation("stiProtection/forms");
  const [formData, setFormData] = useFormData<AppointmentFormData>();
  const now = startOfMonth(new Date());
  const { data: appointments } = useFreeAppointments({
    concern: formData.concern,
    earliestDate: now,
  });

  const appointmentsWithBooked =
    formData.bookedAppointment != null
      ? [formData.bookedAppointment, ...(appointments ?? [])]
      : (appointments ?? []);
  const sortedAppointments = sortBy(appointmentsWithBooked, prop("start"));

  const cancelAppointment = useCancelAppointment(formData.procedureId);
  const bookAppointment = useBookAppointment();
  if ((appointments?.length ?? 0) === 0) {
    return <NoAppointmentAvailable concern={formData.concern} />;
  }

  async function onSubmit(timeSlotData: TimeSlotData) {
    assert.ok(timeSlotData.appointment);
    if (formData.bookedAppointment != null) {
      // If it's the same appointment do nothing
      if (
        isSameAppointment(formData.bookedAppointment, timeSlotData.appointment)
      ) {
        return {};
      }
      // Cancel previous
      await cancelAppointment.mutateAsync();
    }

    const { procedureId } = await bookAppointment.mutateAsync({
      appointmentStart: timeSlotData.appointment.start,
      concern: formData.concern,
      durationInMinutes: differenceInMinutes(
        timeSlotData.appointment.end,
        timeSlotData.appointment.start,
      ),
    });
    return {
      ...timeSlotData,
      date: timeSlotData.date ?? timeSlotData.appointment.start,
      procedureId,
      bookedAppointment: timeSlotData.appointment,
    };
  }

  return (
    <StepLayout initialValues={initialValues} onSubmit={onSubmit}>
      <StepSubTitle title={t("time_slot.title")} />
      <Alert
        color="primary"
        title={t("time_slot.consent_note_title")}
        message={t("time_slot.consent_note_message")}
      />
      <AppointmentPickerSection
        appointments={sortedAppointments}
        name="appointment"
        t={t}
        onDateSelected={(value) =>
          setFormData({
            date: value,
            appointment: undefined,
          })
        }
        onAppointmentSelected={(value) => setFormData({ appointment: value })}
      />
    </StepLayout>
  );
}

function NoAppointmentAvailable({ concern }: { concern: ApiConcern }) {
  const { t } = useTranslation("stiProtection/forms");
  const routes = useCitizenRoutes();
  return (
    <Stack gap={3}>
      <BookAppointmentTitle />
      <Sheet>
        <Stack gap={3} sx={{ padding: 3, alignItems: "center" }}>
          <Typography level="h2" sx={{ alignSelf: "start" }}>
            {t(`time_slot.title`)}
          </Typography>
          <DateRangeOutlined
            sx={(theme) => ({
              height: theme.spacing(10),
              width: theme.spacing(10),
              color: theme.palette.primary.outlinedBorder,
            })}
          />
          <Typography level="title-md">
            {t("time_slot.no_appointments_available")}
          </Typography>
          <Typography
            sx={(theme) => ({
              maxWidth: theme.spacing(80),
            })}
          >
            {t("time_slot.try_later")}
          </Typography>
          <InternalLinkButton
            href={
              concern === ApiConcern.SexWork
                ? routes.sexWork.index
                : routes.stiConsultation.index
            }
            size="lg"
            sx={(theme) => ({
              maxWidth: theme.spacing(44),
              width: "100%",
              minWidth: "min-content",
            })}
          >
            {t("base/translations:common.back")}
          </InternalLinkButton>
        </Stack>
      </Sheet>
    </Stack>
  );
}
