/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DiseasesTable } from "@/lib/businessModules/travelMedicine/components/diseases/DiseasesTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function DiseasesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Krankheiten" />}>
      <MainContentLayout>
        <DiseasesTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
