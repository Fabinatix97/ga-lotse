/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { ProstituteProtectionAppointmentOverview } from "../components/appointmentBlocks/ProstituteProtectionAppointmentOverview";

export function ProstituteProtectionAppointmentsPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Terminübersicht" />}>
      <MainContentLayout fullViewportHeight>
        <ProstituteProtectionAppointmentOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
