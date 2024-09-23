/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GeoShapesOverview } from "@/lib/businessModules/statistics/components/geoshapes/GeoShapesOverview";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function GeoShapesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Geo-Shapes" />}>
      <MainContentLayout fullViewportHeight>
        <GeoShapesOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
