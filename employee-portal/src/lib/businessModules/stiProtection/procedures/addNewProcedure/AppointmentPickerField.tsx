/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import {
  Chip,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { endOfDay, isSameDay, isWithinInterval, startOfDay } from "date-fns";
import { useState } from "react";

import {
  AppointmentCalendar,
  MonthSelectionProps,
} from "./AppointmentCalendar";

interface Appointment {
  start: Date;
}

export interface AppointmentPickerFieldProps<T extends Appointment>
  extends MonthSelectionProps {
  name: string;
  sx?: SxProps;
  className?: string;
  required?: string | undefined;
  active?: boolean;
  monthAppointments: T[];
  onAppointmentSelected?: (d: T) => unknown;
}
export function AppointmentPickerField<T extends Appointment>({
  sx,
  className,
  active,
  currentMonth,
  setCurrentMonth,
  monthAppointments,
  onAppointmentSelected,
  required,
  ...props
}: AppointmentPickerFieldProps<T>) {
  const field = useBaseField<T | undefined>({
    ...props,
    required: active ? required : undefined,
    type: "date",
  });
  const [selectedDay, setSelectedDayRaw] = useState<Date | undefined>(
    field.input.value?.start,
  );

  function setSelectedDay(d: Date) {
    setSelectedDayRaw(d);
    if (!selectedDay || !isSameDay(d, selectedDay)) {
      void field.helpers.setValue(undefined);
    }
  }

  const dateAppointments = monthAppointments.map((t) => t.start);

  return (
    <Stack sx={sx} className={className}>
      <AppointmentCalendar
        selectedDay={active ? selectedDay : undefined}
        onDateSelected={setSelectedDay}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        monthAppointments={dateAppointments}
      />
      <FormControl error={field.error} required={field.required}>
        <AppointmentListForDate
          field={field}
          date={active ? selectedDay : undefined}
          onAppointmentSelected={onAppointmentSelected}
          monthAppointments={monthAppointments}
        />
        {active && field.helperText != null && (
          <FormHelperText>{field.helperText}</FormHelperText>
        )}
      </FormControl>
    </Stack>
  );
}

const timeForm = Intl.DateTimeFormat("de-DE", { timeStyle: "short" });
const dateFullForm = Intl.DateTimeFormat("de-DE", {
  month: "long",
  day: "numeric",
  weekday: "long",
  year: "numeric",
});
function AppointmentListForDate<T extends Appointment>({
  date,
  field,
  monthAppointments,
  onAppointmentSelected,
}: {
  date: Date | undefined;
  field: ReturnType<typeof useBaseField<T | undefined>>;
  monthAppointments: T[];
  onAppointmentSelected?: (d: T) => unknown;
}) {
  const currentInterval = date
    ? {
        start: startOfDay(date),
        end: endOfDay(date),
      }
    : undefined;
  const dayAppointments =
    currentInterval != null
      ? monthAppointments
          .filter((t) => isWithinInterval(t.start, currentInterval))
          .sort()
      : [];
  const hasAppointments = dayAppointments.length > 0;
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
        Uhrzeit
      </Typography>
      <List
        orientation="horizontal"
        wrap
        size="sm"
        sx={{ marginBottom: "16px", gap: "8px", padding: 0 }}
        aria-description={`Liste verfügbarer Termine für ${dateFullForm.format(date)}`}
      >
        {dayAppointments.map((apt) => {
          const isSelected = field.input.value === apt;
          return (
            <ListItem
              sx={{ padding: 0, minHeight: 0 }}
              key={apt.start.toString()}
            >
              <Chip
                variant={isSelected ? "soft" : "plain"}
                color={isSelected ? "primary" : "neutral"}
                sx={{ minWidth: "56px", textAlign: "center" }}
              >
                <Radio
                  component={"time"}
                  dateTime={timeForm.format(apt.start)}
                  disableIcon
                  overlay
                  name={`appointments-${date.getDate()}`}
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
