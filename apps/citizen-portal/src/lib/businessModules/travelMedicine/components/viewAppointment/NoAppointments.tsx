/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DateRangeOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import { OverviewAppointmentType } from "@/lib/businessModules/stiProtection/components/appointments/helpers";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function NoAppointments({
  overviewAppointmentType,
}: Readonly<{
  overviewAppointmentType: OverviewAppointmentType;
}>) {
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  return (
    <ContentSheet>
      <ContentSheetTitle>
        {overviewAppointmentType === OverviewAppointmentType.UPCOMING
          ? t("noAppointments.upcomingAppointments")
          : t("noAppointments.pastAppointments")}
      </ContentSheetTitle>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ paddingBottom: "16px" }}
        data-testid="no-appointments"
      >
        <DateRangeOutlined sx={{ fontSize: 70, color: "#97C3F0" }} />
        <Typography sx={{ fontWeight: "bold" }}>
          {overviewAppointmentType === OverviewAppointmentType.UPCOMING
            ? t("noAppointments.noUpcomingAppointments")
            : t("noAppointments.noPastAppointments")}
        </Typography>
      </Stack>
    </ContentSheet>
  );
}
