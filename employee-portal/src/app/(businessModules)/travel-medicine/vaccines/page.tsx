/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { VaccinesTable } from "@/lib/businessModules/travelMedicine/components/vaccines/VaccinesTable";

export default function VaccinesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Impfstoffe" />}>
      <MainContentLayout>
        <VaccinesTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
