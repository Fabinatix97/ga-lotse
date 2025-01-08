/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ObjectTypesTable } from "@/lib/businessModules/inspection/components/objectType/ObjectTypesTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ObjectTypePage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Objekttypen" />}>
      <MainContentLayout fullViewportHeight>
        <ObjectTypesTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
