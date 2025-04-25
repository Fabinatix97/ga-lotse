/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  Stack,
  Typography,
} from "@mui/joy";
import { format } from "date-fns";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";

import { theme } from "@/lib/baseModule/theme/theme";
import { Appointment } from "@/lib/businessModules/schoolEntry/api/models/Appointment";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/lib/i18n/useLocale";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

function groupAppointmentsByDay(appointments: Appointment[]) {
  const appointmentsByDay = new Map<string, Appointment[]>();
  const dateTimeFormat = Intl.DateTimeFormat("de-DE");

  appointments.forEach((appointment: Appointment) => {
    const date = dateTimeFormat.format(appointment.start);
    if (!appointmentsByDay.has(date)) {
      appointmentsByDay.set(date, []);
    }
    appointmentsByDay.get(date)!.push(appointment);
  });
  return Array.from(appointmentsByDay.values());
}

interface UpdateAppointmentContentProps {
  newAppointment: Appointment | undefined;
  appointmentChangesByCitizenLeft: number;
  freeAppointments: Appointment[];
  setFieldValue: SetFieldValueHelper;
}

export function UpdateAppointmentContent(props: UpdateAppointmentContentProps) {
  const { t } = useTranslation(["schoolEntry/updateAppointment"]);
  const locale = useLocale();
  const appointmentsAvailable = props.freeAppointments.length > 0;
  const appointmentsByDay = groupAppointmentsByDay(props.freeAppointments);

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("title")}</ContentSheetTitle>
      {!appointmentsAvailable && (
        <Alert
          title={t("notAvailable")}
          color="primary"
          message={t("notAvailableMessage")}
        />
      )}
      {appointmentsAvailable && (
        <>
          <Alert
            title={t("available")}
            color="primary"
            message={t("availableMessage", {
              changesLeft: props.appointmentChangesByCitizenLeft,
            })}
          />
          <AccordionGroup sx={{ gap: 2 }} data-testid="availableAppointments">
            {appointmentsByDay.map((appointments, outerIndex) => (
              <Accordion
                key={outerIndex}
                variant="outlined"
                sx={{
                  borderBottom: `1px solid ${theme.palette.neutral.outlinedBorder}`,
                  borderRadius: "md",
                }}
              >
                <AccordionSummary>
                  <Typography level="title-md" sx={{ p: 1 }}>
                    {format(appointments.at(0)!.start, "EEEE, dd. MMMM", {
                      locale,
                    })}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="row" gap={2} flexWrap="wrap">
                    {appointments.map((appointment, innerIndex) => (
                      <Button
                        key={`${outerIndex}, ${innerIndex}`}
                        sx={{
                          width: byBreakpoint({
                            mobile: "61.25px",
                            desktop: "172px",
                          }),
                        }}
                        variant={
                          props.newAppointment === appointment
                            ? "solid"
                            : "soft"
                        }
                        onClick={() =>
                          void props.setFieldValue(
                            "newAppointment",
                            appointment,
                          )
                        }
                      >
                        {format(appointment.start, "HH:mm")}
                      </Button>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionGroup>
        </>
      )}
    </ContentSheet>
  );
}
