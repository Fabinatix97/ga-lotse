/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DateRange } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import assert from "assert";
import { useState } from "react";

import { ApiAppointmentStatus } from "@eshg/sti-protection-api";

import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { AppointmentOverviewSheetButton } from "@/lib/businessModules/stiProtection/components/appointments/AppointmentOverviewSheetButton";
import {
  ApiAppointmentSummary,
  OverviewAppointmentType,
  mapAppointmentHistoryEntryToSummary,
} from "@/lib/businessModules/stiProtection/components/appointments/helpers";
import { useTranslation } from "@/lib/i18n/client";
import {
  TypeSwitchButtonConfig,
  TypeSwitchButtons,
} from "@/lib/shared/components/appointments/TypeSwitchButtons";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";

export function AppointmentsOverviewPage() {
  const { t } = useTranslation(["stiProtection/appointmentOverview"]);

  const { data: procedure } = useGetProcedure();
  const { concern, appointmentHistory, person, appointment } = procedure;

  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState<OverviewAppointmentType>(OverviewAppointmentType.UPCOMING);

  const showUpcomingAppointments =
    selectedAppointmentType === OverviewAppointmentType.UPCOMING;
  const appointments: ApiAppointmentSummary[] = appointmentHistory
    .filter(
      (apptHistory) =>
        (apptHistory.appointmentStatus === ApiAppointmentStatus.Open) ===
        showUpcomingAppointments,
    )
    .map((entry) => mapAppointmentHistoryEntryToSummary(appointment, entry));

  const appointmentTypeConfigs: TypeSwitchButtonConfig<OverviewAppointmentType>[] =
    [
      {
        label: t("type_switch_buttons.upcoming"),
        switchType: OverviewAppointmentType.UPCOMING,
        onClick: (selectedAppointmentType) =>
          setSelectedAppointmentType(selectedAppointmentType),
      },
      {
        label: t("type_switch_buttons.past"),
        switchType: OverviewAppointmentType.PAST,
        onClick: (selectedAppointmentType) =>
          setSelectedAppointmentType(selectedAppointmentType),
      },
    ];
  const accessCode = person.accessCode;
  assert.ok(accessCode, "accessCode is not ok");

  return (
    <PageContent>
      <PageTitle
        toolbar={<LogoutButton text={t("translation:common.leave")} />}
      >
        {t("header.title")}
      </PageTitle>
      <GridColumnStack>
        <TypeSwitchButtons
          selected={selectedAppointmentType}
          configs={appointmentTypeConfigs}
        />
        {!appointments.length ? (
          <ContentSheet>
            <ContentSheetTitle>
              {t("appointments.no_data.past")}
            </ContentSheetTitle>
            <Stack
              gap={2}
              direction="column"
              alignItems="center"
              p={6}
              data-testid="no-appointments"
            >
              <DateRange
                sx={{
                  height: 100,
                  width: 100,
                }}
              />
              <Typography level="title-lg">
                {t("appointments.no_data.default")}
              </Typography>
            </Stack>
          </ContentSheet>
        ) : (
          <Stack role="group" gap={2} aria-label="appointment-overview-list">
            {appointments.map((appointment, index) => (
              <AppointmentOverviewSheetButton
                key={index}
                index={index}
                appointment={appointment}
                concern={concern}
                accessCode={accessCode}
              />
            ))}
          </Stack>
        )}
      </GridColumnStack>
    </PageContent>
  );
}
