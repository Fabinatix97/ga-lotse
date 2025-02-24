/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

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
