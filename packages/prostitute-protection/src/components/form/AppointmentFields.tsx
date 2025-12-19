/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack } from "@mui/joy";
import { startOfHour } from "date-fns";
import { useFormikContext } from "formik";
import { useState } from "react";

import {
  CustomAppointmentQuickButtons,
  DateTimeField,
  RadioSheetOption,
  RadioSheets,
} from "@eshg/lib-employee-portal";
import {
  APPOINTMENT_PICKER_FIELD_LABELS_DE,
  AppointmentPickerField,
  NumberField,
  OptionalFieldValue,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/prostitute-protection-api";

import { useGetFreeAppointments } from "../../api/queries/appointmentBlockApi";
import { APPOINTMENT_FORM_LABELS } from "../../shared/constants";
import { validateDateTimeIsTodayOrFuture } from "../../shared/helpers";

export interface AppointmentFieldsData {
  appointmentBookingType: OptionalFieldValue<ApiAppointmentBookingType>;
  blockAppointment?: ApiAppointment;
  customAppointmentDate?: string;
  duration: number;
}

export function ConnectedAppointmentPicker({ name }: { name: string }) {
  const {
    values: { blockAppointment },
  } = useFormikContext<AppointmentFieldsData>();

  const initialMonth = blockAppointment?.start ?? null;
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? new Date());
  const now = new Date();
  const freeAppointments = useGetFreeAppointments({
    appointmentType: ApiAppointmentType.ProstituteProtectionConsultation,
    earliestDate: startOfHour(now),
  });
  const monthAppointments = freeAppointments.data ?? [];

  return (
    <Box
      sx={(theme) => ({
        background: "white",
        padding: 2,
        marginTop: 1,
        borderRadius: theme.radius.md,
        maxWidth: theme.spacing(46),
      })}
    >
      <AppointmentPickerField
        name={name}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        monthAppointments={monthAppointments}
        required
        labels={APPOINTMENT_PICKER_FIELD_LABELS_DE}
      />
    </Box>
  );
}

export function AppointmentFields() {
  return (
    <RadioSheets
      name="appointmentBookingType"
      required="Bitte eine Buchungsart auswählen"
    >
      <RadioSheetOption
        name="appointmentBookingType"
        value={ApiAppointmentBookingType.AppointmentBlock}
        label="Aus Terminblock"
      >
        <ConnectedAppointmentPicker name="blockAppointment" />
      </RadioSheetOption>
      <RadioSheetOption
        label="Individueller Termin"
        name="appointmentBookingType"
        value={ApiAppointmentBookingType.UserDefined}
      >
        <Stack gap={1} mt={2}>
          <DateTimeField
            name="customAppointmentDate"
            label={APPOINTMENT_FORM_LABELS.appointmentDate}
            required="Datum und Zeit sind erforderlich"
            validate={validateDateTimeIsTodayOrFuture}
          />
          <CustomAppointmentQuickButtons />
          <NumberField
            name="duration"
            label={APPOINTMENT_FORM_LABELS.appointmentDuration}
            required="Die Besuchsdauer ist erforderlich"
            validate={validateIntegerAnd(validateRange(1, 1440))}
          />
        </Stack>
      </RadioSheetOption>
    </RadioSheets>
  );
}
