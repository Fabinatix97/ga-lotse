/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { AppointmentTypeOverviewTable } from "@/lib/businessModules/stiProtection/components/appointmentTypes/AppointmentTypeOverviewTable";

export default function AppointmentTypeOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminarten" />}>
      <MainContentLayout>
        <AppointmentTypeOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
