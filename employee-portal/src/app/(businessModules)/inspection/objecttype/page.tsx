/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

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
