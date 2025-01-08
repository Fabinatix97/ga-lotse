/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

import {
  AppointmentOverviewSection,
  AppointmentOverviewSectionTitle,
} from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentOverviewSection";

interface AppointmentOverviewBookingTypeStatusProps {
  icon: ReactNode;
  testId: string;
  text: string;
}

export function AppointmentOverviewButtonElement(
  props: Readonly<AppointmentOverviewBookingTypeStatusProps>,
) {
  return (
    <AppointmentOverviewSection icon={props.icon}>
      <AppointmentOverviewSectionTitle data-testid={props.testId}>
        {props.text}
      </AppointmentOverviewSectionTitle>
    </AppointmentOverviewSection>
  );
}
