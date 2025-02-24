/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { GeoShapesOverview } from "@/lib/businessModules/statistics/components/geoshapes/GeoShapesOverview";

export default function GeoShapesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Geo-Shapes" />}>
      <MainContentLayout fullViewportHeight>
        <GeoShapesOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
