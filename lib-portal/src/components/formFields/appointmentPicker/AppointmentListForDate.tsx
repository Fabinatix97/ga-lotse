/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Chip,
  ChipProps,
  Divider,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/joy";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { useId } from "react";

import { ifDefined } from "../../../helpers/ifDefined";
import { useBaseField } from "../BaseField";

import { Appointment } from "./AppointmentPickerField";
import { timeForm } from "./helpers";

export type AppointmentListLabelType = ((date: Date) => string) | string;

export interface UseAppointmentListProps<T extends Appointment> {
  selectedDay: Date | undefined;
  monthAppointments: T[];
  listLabel: AppointmentListLabelType;
}
export function useAppointmentList<T extends Appointment>({
  selectedDay,
  monthAppointments,
  listLabel,
}: UseAppointmentListProps<T>): { appointments: T[]; label: string } {
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

  const stringListLabel =
    typeof listLabel === "function"
      ? (ifDefined(selectedDay, listLabel) ?? "")
      : listLabel;

  return {
    label: stringListLabel,
    appointments: dayAppointments,
  };
}

export interface AppointmentListProps<T extends Appointment> {
  date: Date | undefined;
  field: ReturnType<typeof useBaseField<T | null>>;
  appointments: T[];
  onAppointmentSelected?: (d: T) => unknown;
  isAppointmentEqual?: (apt1: T, apt2: T) => boolean;
  label: string;
}
export function AppointmentListForDate<T extends Appointment>({
  date,
  field,
  appointments,
  onAppointmentSelected,
  isAppointmentEqual = (apt1, apt2) => apt1 === apt2,
  label,
  slotProps,
  getLabel = (apt) => timeForm.format(apt.start),
}: AppointmentListProps<T> & {
  slotProps?: {
    chip?: Omit<ChipProps, "variant" | "color">;
  };
  getLabel?: (appointment: T) => string;
}) {
  const theme = useTheme();
  const labelId = useId();
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

  const { sx: chipSx, ...otherChipProps } = slotProps?.chip ?? {};

  return (
    <RadioGroup>
      <Divider sx={{ my: 2 }} />
      <Typography component="label" my={2} id={labelId}>
        <Typography component="span" level="title-md">
          {label}
        </Typography>
      </Typography>
      <List
        aria-describedby={labelId}
        orientation="horizontal"
        wrap
        size="sm"
        sx={{ marginBottom: "16px", gap: "8px", padding: 0 }}
      >
        {appointments.map((apt) => {
          const isSelected =
            !!field.input.value && isAppointmentEqual(field.input.value, apt);
          return (
            <ListItem
              sx={{ padding: 0, minHeight: 0 }}
              key={apt.start.getTime()}
            >
              <Chip
                variant={isSelected ? "solid" : "soft"}
                color={isSelected ? "primary" : "neutral"}
                sx={{
                  minWidth: "56px",
                  textAlign: "center",
                  paddingX: 2,
                  ...chipSx,
                }}
                {...otherChipProps}
              >
                <Radio
                  disableIcon
                  overlay
                  slotProps={{
                    action: {
                      sx: { border: "none" },
                    },
                  }}
                  value={apt.start}
                  color="primary"
                  checked={isSelected}
                  onChange={createOnSelected(apt)}
                  label={
                    <Typography
                      component={"time"}
                      dateTime={apt.start.toTimeString().slice(0, 5)}
                      level="title-md"
                      sx={{
                        color: isSelected ? "white" : undefined,
                        ".MuiListItem-root:hover &": {
                          color: isSelected ? "black" : undefined,
                        },
                        fontSize: theme.fontSize.md,
                        fontWeight: theme.fontWeight.md,
                      }}
                    >
                      {getLabel(apt)}
                    </Typography>
                  }
                />
              </Chip>
            </ListItem>
          );
        })}
      </List>
    </RadioGroup>
  );
}
