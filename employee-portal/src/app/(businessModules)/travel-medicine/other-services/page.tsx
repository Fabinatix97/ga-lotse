/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { OtherServiceTable } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/OtherServiceTable";

export default function OtherServicesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Sonstige Leistungen" />}>
      <MainContentLayout>
        <OtherServiceTable></OtherServiceTable>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
