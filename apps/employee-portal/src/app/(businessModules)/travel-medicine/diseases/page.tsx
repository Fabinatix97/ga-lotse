/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { DiseasesTable } from "@/lib/businessModules/travelMedicine/components/diseases/DiseasesTable";

export default function DiseasesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Krankheiten" />}>
      <MainContentLayout>
        <DiseasesTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
