/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { ObjectTypesTable } from "@/lib/businessModules/inspection/components/objectType/ObjectTypesTable";
import { ObjectTypesTableOld } from "@/lib/businessModules/inspection/components/objectType/ObjectTypesTableOld";

export default function ObjectTypePage() {
  const featureToggleEnabled = useIsNewFeatureEnabled("OBJECT_TYPE_HIERARCHY");

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Objekttypen" />}>
      <MainContentLayout fullViewportHeight>
        {featureToggleEnabled ? <ObjectTypesTable /> : <ObjectTypesTableOld />}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
