/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import {
  AppointmentPickerField,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";
import { Stack, Typography } from "@mui/joy";
import { useField } from "formik";
import { useState } from "react";

import { useGetFreeAppointmentsUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";

interface AppointmentRadioGroupProps {
  type?: ApiAppointmentType;
  appointmentBlockDateOption?: SelectOption;
  required?: boolean;
}

export function LegacyAppointmentRadioGroup({
  required = true,
  ...props
}: Readonly<AppointmentRadioGroupProps>) {
  const getAllFreeConsultationBlockAppointments =
    useGetFreeAppointmentsUnsuspended(ApiAppointmentType.Consultation);
  const freeConsultationBlockAppointments =
    getAllFreeConsultationBlockAppointments.data ?? [];

  const getAllFreeVaccinationBlockAppointments =
    useGetFreeAppointmentsUnsuspended(ApiAppointmentType.Vaccination);
  const freeVaccinationBlockAppointments =
    getAllFreeVaccinationBlockAppointments.data ?? [];

  const [bookingTypeFieldProps] = useField("bookingType");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <Stack gap={2}>
      <Typography level="body-md" sx={{ fontWeight: "bold", mt: 2 }}>
        Termin
      </Typography>
      <RadioGroupField
        name="bookingType"
        required={required ? "Bitte einen Termintyp auswählen" : undefined}
      >
        <SelectableCard
          key={ApiAppointmentBookingType.AppointmentBlock}
          value={ApiAppointmentBookingType.AppointmentBlock}
          sx={{ mb: 2 }}
          radioProps={{ overlay: false }}
          allowDeselection={!required}
          changeBackgroundColor={false}
          forGroupName="bookingType"
        >
          <Stack gap={2}>
            <Typography level={"body-sm"} sx={{ fontWeight: "500" }}>
              Aus Terminblock
            </Typography>
            <AppointmentPickerField
              name={"appointmentBlockDate"}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              monthAppointments={
                props.type == ApiAppointmentType.Consultation
                  ? freeConsultationBlockAppointments
                  : freeVaccinationBlockAppointments
              }
              required={bookingTypeFieldProps.value === "AppointmentBlock"}
              labels={FIELD_LABELS_DE}
            />
          </Stack>
        </SelectableCard>
        <SelectableCard
          key={ApiAppointmentBookingType.UserDefined}
          value={ApiAppointmentBookingType.UserDefined}
          sx={{ mb: 2 }}
          radioProps={{ overlay: false }}
          allowDeselection={!required}
          changeBackgroundColor={false}
          forGroupName={"bookingType"}
        >
          <Stack gap={2} sx={{ flexGrow: 1 }}>
            <DateTimeField
              label={"Individueller Termin"}
              name={"userDefinedAppointmentDate"}
            />
            <NumberField
              label={"Termin Dauer in Min."}
              name={"appointmentTypeStandardDuration"}
            ></NumberField>
          </Stack>
        </SelectableCard>
      </RadioGroupField>
    </Stack>
  );
}
