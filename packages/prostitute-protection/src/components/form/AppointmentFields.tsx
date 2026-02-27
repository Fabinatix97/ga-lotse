/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { addMinutes, startOfHour } from "date-fns";
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
  Alert,
  AppointmentPickerField,
  NumberField,
  OptionalFieldValue,
  toDateTimeString,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiProstituteProtectionProcedureType,
} from "@eshg/prostitute-protection-api";

import { useGetFreeAppointmentsOptions } from "../../api/queries/appointmentBlockApi";
import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";
import { APPOINTMENT_FORM_LABELS } from "../../shared/constants";

export interface AppointmentFieldsData {
  procedureType: ApiProstituteProtectionProcedureType;
  appointmentBookingType: OptionalFieldValue<ApiAppointmentBookingType>;
  blockAppointment?: ApiAppointment;
  customAppointmentDate?: string;
  duration: number;
}

function ConnectedAppointmentPicker({
  name,
  freeAppointments,
}: {
  name: string;
  freeAppointments: ApiAppointment[];
}) {
  const {
    values: { blockAppointment },
  } = useFormikContext<AppointmentFieldsData>();

  const initialMonth = blockAppointment?.start ?? null;
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? new Date());

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
        monthAppointments={freeAppointments}
        required
        labels={APPOINTMENT_PICKER_FIELD_LABELS_DE}
      />
    </Box>
  );
}

interface AppointmentFieldsProps {
  isCreation?: boolean;
}

export function AppointmentFields(props: AppointmentFieldsProps) {
  const { values, setFieldValue } = useFormikContext<AppointmentFieldsData>();
  const { appointmentBlockApi } = useProstituteProtectionApiClients();
  const { data: freeAppointments } = useQuery(
    useGetFreeAppointmentsOptions(
      {
        procedureType: values.procedureType,
        earliestDate: startOfHour(new Date()),
      },
      appointmentBlockApi,
    ),
  );
  return (
    <RadioSheets
      name="appointmentBookingType"
      aria-label="Buchungsart"
      required="Bitte eine Buchungsart auswählen"
    >
      {freeAppointments?.length === 0 && (
        <Alert
          color="warning"
          message="Es sind keine freien Terminblöcke verfügbar."
        />
      )}
      <RadioSheetOption
        name="appointmentBookingType"
        value={ApiAppointmentBookingType.AppointmentBlock}
        label="Aus Terminblock"
        disabled={freeAppointments?.length === 0}
      >
        <ConnectedAppointmentPicker
          name="blockAppointment"
          freeAppointments={freeAppointments ?? []}
        />
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
      {props.isCreation && (
        <RadioSheetOption
          label="Spontaner Termin"
          name="appointmentBookingType"
          value={ApiAppointmentBookingType.Spontaneous}
          onSelect={() => {
            const now = new Date();
            void setFieldValue(
              "customAppointmentDate",
              toDateTimeString(addMinutes(now, 5 - (now.getMinutes() % 5))),
            );
          }}
        >
          <Stack gap={1} mt={2}>
            <DateTimeField
              name="customAppointmentDate"
              label={APPOINTMENT_FORM_LABELS.appointmentDate}
              disabled
            />
            <NumberField
              name="duration"
              label={APPOINTMENT_FORM_LABELS.appointmentDuration}
              required="Die Besuchsdauer ist erforderlich"
              validate={validateIntegerAnd(validateRange(1, 1440))}
            />
          </Stack>
        </RadioSheetOption>
      )}
    </RadioSheets>
  );
}
