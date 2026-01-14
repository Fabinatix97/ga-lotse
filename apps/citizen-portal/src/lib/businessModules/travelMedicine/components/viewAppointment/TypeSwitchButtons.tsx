/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Sheet, ToggleButtonGroup } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { OverviewAppointmentType } from "@/lib/businessModules/stiProtection/components/appointments/helpers";
import { useTranslation } from "@/lib/i18n/client";

export function TypeSwitchButtons({
  overviewAppointmentType,
  setOverviewAppointmentType,
}: Readonly<{
  overviewAppointmentType: OverviewAppointmentType;
  setOverviewAppointmentType: Dispatch<SetStateAction<OverviewAppointmentType>>;
}>) {
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  return (
    <Sheet
      sx={{
        padding: 0,
      }}
    >
      <ToggleButtonGroup data-testid="type-switch-buttons" color="neutral">
        <Button
          data-testid={
            overviewAppointmentType === OverviewAppointmentType.UPCOMING
              ? "type-switch-button-active"
              : "type-switch-button"
          }
          variant={
            overviewAppointmentType === OverviewAppointmentType.UPCOMING
              ? "solid"
              : "plain"
          }
          color="primary"
          sx={(theme) => ({
            flex: 1,
            height: "40px",
            "--variant-softColor": theme.palette.primary.solidBg,
            fontSize: "1rem",
          })}
          onClick={() =>
            setOverviewAppointmentType(OverviewAppointmentType.UPCOMING)
          }
        >
          {t("typeSwitchButtons.upcoming")}
        </Button>
        <Button
          data-testid={
            overviewAppointmentType === OverviewAppointmentType.PAST
              ? "type-switch-button-active"
              : "type-switch-button"
          }
          variant={
            overviewAppointmentType === OverviewAppointmentType.PAST
              ? "solid"
              : "plain"
          }
          color="primary"
          sx={(theme) => ({
            flex: 1,
            height: "40px",
            "--variant-softColor": theme.palette.primary.solidBg,
            fontSize: "1rem",
          })}
          onClick={() =>
            setOverviewAppointmentType(OverviewAppointmentType.PAST)
          }
        >
          {t("typeSwitchButtons.past")}
        </Button>
      </ToggleButtonGroup>
    </Sheet>
  );
}
