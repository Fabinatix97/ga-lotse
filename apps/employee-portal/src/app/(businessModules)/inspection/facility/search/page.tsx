/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { FacilitiesWebSearchPageContent } from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchPageContent";

export default function FacilitiesWebSearchPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Einrichtungen suchen" />}>
      <MainContentLayout fullViewportHeight>
        <FacilitiesWebSearchPageContent />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
