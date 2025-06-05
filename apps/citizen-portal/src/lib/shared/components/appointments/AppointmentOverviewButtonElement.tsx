/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";

import {
  AppointmentOverviewSection,
  AppointmentOverviewSectionTitle,
} from "@/lib/shared/components/appointments/AppointmentOverviewSection";

interface AppointmentOverviewBookingTypeStatusProps {
  icon: ReactNode;
  testId?: string;
  text: ReactNode;
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
