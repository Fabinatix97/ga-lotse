/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Sheet, ToggleButtonGroup } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { useTranslation } from "@/lib/i18n/client";

export enum OverviewAppointmentTypes {
  UPCOMING,
  PAST,
}

export function TypeSwitchButtons({
  overviewAppointmentType,
  setOverviewAppointmentType,
}: Readonly<{
  overviewAppointmentType: OverviewAppointmentTypes;
  setOverviewAppointmentType: Dispatch<
    SetStateAction<OverviewAppointmentTypes>
  >;
}>) {
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  return (
    <Sheet
      sx={{
        padding: 0,
      }}
    >
      <ToggleButtonGroup data-testid={"type-switch-buttons"} color="neutral">
        <Button
          data-testid={
            overviewAppointmentType === OverviewAppointmentTypes.UPCOMING
              ? "type-switch-button-active"
              : "type-switch-button"
          }
          variant={
            overviewAppointmentType === OverviewAppointmentTypes.UPCOMING
              ? "solid"
              : "plain"
          }
          color={"primary"}
          sx={(theme) => ({
            flex: 1,
            height: "40px",
            "--variant-softColor": theme.palette.primary.solidBg,
            fontSize: "1rem",
          })}
          onClick={() =>
            setOverviewAppointmentType(OverviewAppointmentTypes.UPCOMING)
          }
        >
          {t("typeSwitchButtons.upcoming")}
        </Button>
        <Button
          data-testid={
            overviewAppointmentType === OverviewAppointmentTypes.PAST
              ? "type-switch-button-active"
              : "type-switch-button"
          }
          variant={
            overviewAppointmentType === OverviewAppointmentTypes.PAST
              ? "solid"
              : "plain"
          }
          color={"primary"}
          sx={(theme) => ({
            flex: 1,
            height: "40px",
            "--variant-softColor": theme.palette.primary.solidBg,
            fontSize: "1rem",
          })}
          onClick={() =>
            setOverviewAppointmentType(OverviewAppointmentTypes.PAST)
          }
        >
          {t("typeSwitchButtons.past")}
        </Button>
      </ToggleButtonGroup>
    </Sheet>
  );
}
