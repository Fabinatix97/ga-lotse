/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentListProps } from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentListForDate";
import {
  Appointment,
  AppointmentPickerField,
  AppointmentPickerLayoutProps,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { timeForm } from "@eshg/lib-portal/components/formFields/appointmentPicker/helpers";
import { ApiAppointment } from "@eshg/official-medical-service-api";
import {
  Box,
  Chip,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Sheet,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { isEqual } from "date-fns";
import { useId, useState } from "react";

import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

interface AppointmentStepProps {
  appointments: ApiAppointment[];
}

export function AppointmentStep({
  appointments,
}: Readonly<AppointmentStepProps>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const [month, setMonth] = useState<Date>(
    appointments[0]?.start ?? new Date(),
  );

  return (
    <ContentSheet data-testid={"appointment-slot-form"}>
      <Typography level="h2">{t("appointment.title")}</Typography>
      <AppointmentPickerField
        name="appointment"
        currentMonth={month}
        setCurrentMonth={setMonth}
        monthAppointments={appointments}
        labels={{
          requiredAppointment: t(
            "appointment.appointmentPicker.requiredAppointment",
          ),
          requiredDay: t("appointment.appointmentPicker.requiredDay"),
          monthSelection: t("appointment.appointmentPicker.monthSelection"),
          nextMonth: t("appointment.appointmentPicker.nextMonth"),
          prevMonth: t("appointment.appointmentPicker.prevMonth"),
          listLabel: t("appointment.appointmentPicker.listLabel"),
        }}
        isAppointmentEqual={(apt1: ApiAppointment, apt2: ApiAppointment) =>
          isEqual(apt1.start, apt2.start) && isEqual(apt1.end, apt2.end)
        }
        layout={Layout}
        appointmentList={AppointmentListForDate}
        required={true}
      />
    </ContentSheet>
  );
}

function Layout({
  sx,
  className,
  calendar,
  appointmentList,
}: Readonly<AppointmentPickerLayoutProps>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const isMobile = useIsMobile();

  const givenSx = sx == null ? [] : sx instanceof Array ? sx : [sx];
  const sxProps = [
    {
      margin: 0,
      padding: 0,
      border: 0,
      "& > .MuiFormControl-root": {
        width: "100%",
      },
    },
    ...givenSx,
  ];
  return (
    <Stack
      component="fieldset"
      sx={sxProps}
      className={className}
      aria-label={t("appointment.title")}
      direction={isMobile ? "column" : "row"}
      gap={4}
    >
      <Stack direction="column" gap={2}>
        <Typography component="label">
          <Typography component="span" level="title-md">
            {t("appointment.appointmentPicker.calendarTitle")}
          </Typography>
        </Typography>
        <Sheet
          variant="soft"
          sx={{
            borderRadius: "sm",
            "div[role=grid]": {
              width: "100%",
            },
          }}
        >
          {calendar}
        </Sheet>
        <Typography
          sx={{ paddingLeft: 2 }}
          startDecorator={
            <Box
              sx={{
                backgroundColor: "#0B6BCB",
                height: "4px",
                width: "10px",
              }}
            />
          }
        >
          {t("appointment.appointmentPicker.available")}
        </Typography>
      </Stack>
      {appointmentList}
    </Stack>
  );
}

function AppointmentListForDate<T extends Appointment>({
  date,
  field,
  appointments,
  onAppointmentSelected,
  isAppointmentEqual = (apt1, apt2) => apt1 === apt2,
  label,
}: Readonly<AppointmentListProps<T>>) {
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

  return (
    <Stack direction="column" gap={2}>
      <Typography component="label" id={labelId}>
        <Typography component="span" level="title-md">
          {label}
        </Typography>
      </Typography>
      <RadioGroup sx={{ margin: 0 }}>
        <List
          aria-describedby={labelId}
          orientation="horizontal"
          sx={{
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "40px",
            gap: 2,
            maxWidth: "382px",
          }}
        >
          {appointments.map((apt) => {
            const isSelected =
              !!field.input.value && isAppointmentEqual(field.input.value, apt);
            return (
              <ListItem sx={{ padding: 0 }} key={apt.start.getTime()}>
                <Chip
                  variant={isSelected ? "solid" : "soft"}
                  color={isSelected ? "primary" : "neutral"}
                  sx={{
                    textAlign: "center",
                    borderRadius: "sm",
                    height: "100%",
                    minWidth: "100%",
                  }}
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
                        component="time"
                        dateTime={apt.start.toTimeString().slice(0, 5)}
                        level="title-md"
                        color="primary"
                        sx={{
                          color: isSelected ? "white" : undefined,
                          ".MuiListItem-root:hover &": {
                            color: isSelected ? "black" : undefined,
                          },
                          fontSize: theme.fontSize.md,
                          fontWeight: theme.fontWeight.lg,
                          height: "40px",
                        }}
                      >
                        {timeForm.format(apt.start)}
                      </Typography>
                    }
                  />
                </Chip>
              </ListItem>
            );
          })}
        </List>
      </RadioGroup>
    </Stack>
  );
}
