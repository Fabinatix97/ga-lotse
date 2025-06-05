/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { useFormikContext } from "formik";
import { useState } from "react";

import {
  APPOINTMENT_PICKER_FIELD_LABELS_DE,
  AppointmentPickerField,
} from "@eshg/lib-portal";

import { AddNewProcedureForm } from "./useAddNewProcedureSidebar";

export function ConnectedAppointmentPicker({ name }: { name: string }) {
  const {
    values: { blockAppointment },
  } = useFormikContext<AddNewProcedureForm>();

  const initialMonth = blockAppointment?.start ?? null;
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? new Date());
  // const now = new Date();
  const freeAppointments = { data: [] };
  // useGetFreeAppointments({
  //   earliestDate: startOfHour(now),
  // });
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
