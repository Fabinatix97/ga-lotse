/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { VaccinesTable } from "@/lib/businessModules/travelMedicine/components/vaccines/VaccinesTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function VaccinesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Impfstoffe" />}>
      <MainContentLayout>
        <VaccinesTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
