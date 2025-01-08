/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentTypeOverviewTable } from "@/lib/businessModules/stiProtection/components/appointmentTypes/AppointmentTypeOverviewTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function AppointmentTypeOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminarten" />}>
      <MainContentLayout>
        <AppointmentTypeOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
