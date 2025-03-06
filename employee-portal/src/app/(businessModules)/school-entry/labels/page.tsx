/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { useGetLabels } from "@/lib/businessModules/schoolEntry/api/queries/labelApi";
import { LabelsTable } from "@/lib/businessModules/schoolEntry/features/labels/LabelsTable";

export default function LabelsOverviewPage() {
  const getLabels = useGetLabels();

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Kennungen" />}>
      <MainContentLayout fullViewportHeight>
        <LabelsTable labels={getLabels.data} loading={getLabels.isFetching} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
