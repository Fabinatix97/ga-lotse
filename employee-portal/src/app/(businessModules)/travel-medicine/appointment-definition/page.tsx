/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { AppointmentTypesTable } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/AppointmentTypesTable";

export default function AppointmentTypeOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminarten" />}>
      <MainContentLayout>
        <AppointmentTypesTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
