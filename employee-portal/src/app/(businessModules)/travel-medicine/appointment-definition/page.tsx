/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentTypesTable } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/AppointmentTypesTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function AppointmentTypeOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminarten" />}>
      <MainContentLayout>
        <AppointmentTypesTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
