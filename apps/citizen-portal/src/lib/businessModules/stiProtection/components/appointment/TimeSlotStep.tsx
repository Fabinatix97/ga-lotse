/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import assert from "assert";
import { isSameDay, startOfMonth } from "date-fns";
import { isNonNullish, prop, sortBy } from "remeda";

import { PortalErrorCode, isSameAppointment } from "@eshg/lib-portal";

import {
  useBookAppointment,
  useCancelPendingAppointment,
} from "@/lib/businessModules/stiProtection/api/mutations/publicCitizenApi";
import { useFreeAppointments } from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";
import { NoAppointmentAvailable } from "@/lib/businessModules/stiProtection/components/shared/NoAppointmentAvailable";
import { useTranslation } from "@/lib/i18n/client";
import { AppointmentPickerSection } from "@/lib/shared/components/AppointmentPickerSection";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";
import { StepLayout } from "./StepLayout";
import { StepSubTitle } from "./StepSubTitle";
import { mapToBookAppointment } from "./helpers";

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
    formData.bookedAppointment !== undefined
      ? [formData.bookedAppointment, ...(appointments ?? [])]
      : (appointments ?? []);
  const sortedAppointments = sortBy(appointmentsWithBooked, prop("start"));

  const cancelPendingAppointment = useCancelPendingAppointment(
    formData.procedureId,
  );
  const bookAppointment = useBookAppointment();
  if ((appointments?.length ?? 0) === 0) {
    return <NoAppointmentAvailable concern={formData.concern} />;
  }

  async function onSubmit(timeSlotData: TimeSlotData) {
    assert.ok(timeSlotData.appointment);
    if (formData.bookedAppointment !== undefined) {
      // If it's the same appointment do nothing
      if (
        isSameAppointment(formData.bookedAppointment, timeSlotData.appointment)
      ) {
        return {};
      }
      // Cancel previous
      await cancelPendingAppointment.mutateAsync();
    }

    const result = await bookAppointment.mutateAsync(
      mapToBookAppointment({
        appointment: timeSlotData.appointment,
        concern: formData.concern,
      }),
    );
    if (result === PortalErrorCode.Conflict) {
      return PortalErrorCode.Conflict;
    }
    const { procedureId } = result;
    return {
      ...timeSlotData,
      date: timeSlotData.date ?? timeSlotData.appointment.start,
      procedureId,
      bookedAppointment: timeSlotData.appointment,
    };
  }

  function handleDateSelected(value: Date) {
    if (isNonNullish(formData.date) && isSameDay(value, formData.date)) {
      return;
    }
    setFormData({
      date: value,
      appointment: undefined,
    });
  }

  return (
    <StepLayout initialValues={initialValues} onSubmit={onSubmit}>
      <StepSubTitle title={t("time_slot.title")} />
      <AppointmentPickerSection
        appointments={sortedAppointments}
        name="appointment"
        t={t}
        onDateSelected={handleDateSelected}
        onAppointmentSelected={(value) => setFormData({ appointment: value })}
      />
    </StepLayout>
  );
}
