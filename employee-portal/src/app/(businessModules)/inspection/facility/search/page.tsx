/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FacilitiesWebSearchPageContent } from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchPageContent";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function FacilitiesWebSearchPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Einrichtungen suchen" />}>
      <MainContentLayout fullViewportHeight>
        <FacilitiesWebSearchPageContent />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
