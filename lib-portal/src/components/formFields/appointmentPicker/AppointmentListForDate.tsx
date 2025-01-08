/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chip, List, ListItem, Radio, RadioGroup, Typography } from "@mui/joy";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

import { useBaseField } from "../BaseField";

import { Appointment } from "./AppointmentPickerField";
import { dateFullForm, timeForm } from "./helpers";

export type AppointmentListDescriptionType =
  | ((date: string) => string)
  | string;

export interface UseAppointmentListProps<T extends Appointment> {
  selectedDay: Date | undefined;
  monthAppointments: T[];
  listDescription: AppointmentListDescriptionType;
}
export function useAppointmentList<T extends Appointment>({
  selectedDay,
  monthAppointments,
  listDescription,
}: UseAppointmentListProps<T>): { appointments: T[]; description: string } {
  const currentDayInterval = selectedDay
    ? {
        start: startOfDay(selectedDay),
        end: endOfDay(selectedDay),
      }
    : undefined;
  const dayAppointments =
    currentDayInterval != null
      ? monthAppointments
          .filter((t) => isWithinInterval(t.start, currentDayInterval))
          .sort()
      : [];

  const stringListDescription =
    typeof listDescription === "function"
      ? listDescription(dateFullForm.format(selectedDay))
      : listDescription;

  return {
    description: stringListDescription,
    appointments: dayAppointments,
  };
}

export interface AppointmentListProps<T extends Appointment> {
  date: Date | undefined;
  field: ReturnType<typeof useBaseField<T | null>>;
  appointments: T[];
  onAppointmentSelected?: (d: T) => unknown;
  description: string;
  label: string;
}
export function AppointmentListForDate<T extends Appointment>({
  date,
  field,
  appointments,
  onAppointmentSelected,
  description,
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
    <RadioGroup>
      <Typography level="title-md" my={2}>
        {label}
      </Typography>
      <List
        orientation="horizontal"
        wrap
        size="sm"
        sx={{ marginBottom: "16px", gap: "8px", padding: 0 }}
        aria-description={description}
      >
        {appointments.map((apt) => {
          const isSelected = field.input.value === apt;
          return (
            <ListItem
              sx={{ padding: 0, minHeight: 0 }}
              key={apt.start.getTime()}
            >
              <Chip
                variant={isSelected ? "soft" : "plain"}
                color={isSelected ? "primary" : "neutral"}
                sx={{ minWidth: "56px", textAlign: "center" }}
              >
                <Radio
                  component={"time"}
                  dateTime={apt.start.toTimeString().slice(0, 5)}
                  disableIcon
                  overlay
                  value={apt.start}
                  checked={isSelected}
                  onChange={createOnSelected(apt)}
                  label={timeForm.format(apt.start)}
                />
              </Chip>
            </ListItem>
          );
        })}
      </List>
    </RadioGroup>
  );
}
