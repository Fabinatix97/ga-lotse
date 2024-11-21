/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OtherServiceTable } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/OtherServiceTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function OtherServicesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Sonstige Leistungen" />}>
      <MainContentLayout>
        <OtherServiceTable></OtherServiceTable>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
