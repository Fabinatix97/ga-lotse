/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetLabels } from "@/lib/businessModules/schoolEntry/api/queries/labelApi";
import { LabelsTable } from "@/lib/businessModules/schoolEntry/features/labels/LabelsTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
