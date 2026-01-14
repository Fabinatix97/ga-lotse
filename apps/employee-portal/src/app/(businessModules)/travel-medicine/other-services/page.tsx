/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { OtherServiceTable } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/OtherServiceTable";

export default function OtherServicesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Sonstige Leistungen" />}>
      <MainContentLayout>
        <OtherServiceTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
