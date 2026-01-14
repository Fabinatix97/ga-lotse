/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { SchoolEntryAppointmentOverview } from "@/lib/businessModules/schoolEntry/features/appointments/SchoolEntryAppointmentOverview";

export default function AppointmentBlockGroupsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminübersicht" />}>
      <MainContentLayout fullViewportHeight>
        <SchoolEntryAppointmentOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
