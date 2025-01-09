/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Row } from "@eshg/lib-portal/components/Row";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { AppointmentListProps } from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentListForDate";
import {
  AppointmentPickerField,
  AppointmentPickerLayoutProps,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { CheckBox } from "@mui/icons-material";
import { Box, Button, List, ListItem, Stack, Typography } from "@mui/joy";
import { addMinutes } from "date-fns";
import { Formik } from "formik";
import { useState } from "react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

const now = new Date();
interface Appointment {
  start: Date;
  end: Date;
}

const appointments = new Array(100).fill(0).map((_, t): Appointment => {
  const start = addMinutes(now, t * 15 + (t % 10) * 3600);
  return {
    start,
    end: addMinutes(start, 10),
  };
});

const initialData: { appointment: Appointment | undefined } = {
  appointment: undefined,
};

export default function AppointmentPickerPlaygroundPage() {
  const [month, setMonth] = useState<Date>(new Date());
  const [appointment, setAppointment] = useState<Appointment | undefined>();
  const snackbar = useSnackbar();
  function handleSubmit(values: typeof initialData) {
    setAppointment(values.appointment);
    snackbar.confirmation("Termin genomen");
    return;
  }

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Appointment Picker" backHref="/playground" />}
    >
      <MainContentLayout>
        <Formik initialValues={initialData} onSubmit={handleSubmit}>
          <FormPlus>
            <Stack gap={2}>
              <Typography level="h2">Appointment Picker Field</Typography>
              <p>Ausgewählte Termine: {appointment?.start.toLocaleString()}</p>
              <AppointmentPickerField
                name="appointment"
                currentMonth={month}
                setCurrentMonth={setMonth}
                monthAppointments={appointments}
                required={true}
                labels={FIELD_LABELS_DE}
              />
              <div>
                <SubmitButton submitting={false}>Submit</SubmitButton>
              </div>
            </Stack>
          </FormPlus>
        </Formik>
        <Box my={4} />
        <Formik initialValues={initialData} onSubmit={handleSubmit}>
          <FormPlus>
            <Stack gap={2}>
              <Typography level="h2">
                Appointment Picker Field with alternative Layout
              </Typography>
              <p>Ausgewählte Termine: {appointment?.start.toLocaleString()}</p>
              <AppointmentPickerField
                name="appointment"
                currentMonth={month}
                setCurrentMonth={setMonth}
                monthAppointments={appointments}
                required={true}
                labels={FIELD_LABELS_DE}
                layout={AltLayout}
                appointmentList={AltAppointmentList}
              />
            </Stack>
          </FormPlus>
        </Formik>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function AltLayout({
  sx,
  className,
  calendar,
  appointmentList,
}: AppointmentPickerLayoutProps) {
  return (
    <Row sx={sx} gap={3} className={className}>
      {calendar}
      {appointmentList}
    </Row>
  );
}

function AltAppointmentList<T extends Appointment>({
  date,
  field,
  appointments,
  onAppointmentSelected,
  label,
}: AppointmentListProps<T>) {
  const hasAppointments = appointments.length > 0;
  if (!hasAppointments || !date) {
    return null;
  }

  function createOnSelected(d: T) {
    return () => {
      onAppointmentSelected?.(d);
      return field.helpers.setValue(d);
    };
  }

  return (
    <Box>
      <Typography level="title-md" my={2}>
        {label}
      </Typography>
      <List
        orientation="vertical"
        wrap
        size="sm"
        sx={{ marginBottom: "16px", gap: "8px", padding: 0 }}
      >
        {appointments.map((apt) => {
          const isSelected = field.input.value === apt;
          return (
            <ListItem
              sx={{ padding: 0, minHeight: 0 }}
              key={apt.start.getTime()}
            >
              <time dateTime={apt.start.toTimeString().slice(0, 5)}>
                <Button
                  type="submit"
                  onClick={createOnSelected(apt)}
                  aria-selected={isSelected}
                  sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                >
                  {isSelected && <CheckBox />}
                  {apt.start.toLocaleTimeString()}
                </Button>
              </time>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
