/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { ObjectTypesTable } from "@/lib/businessModules/inspection/components/objectType/ObjectTypesTable";

export default function ObjectTypePage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Objekttypen" />}>
      <MainContentLayout fullViewportHeight>
        <ObjectTypesTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
