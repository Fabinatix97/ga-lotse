/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ProcedureLabelsPage } from "@eshg/lib-employee-portal";

import { useLabelApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export default function LabelsOverviewPage() {
  const labelApi = useLabelApi();
  return (
    <ProcedureLabelsPage
      procedureLabelApi={labelApi}
      procedureLabelApiQueryKey={schoolEntryApiQueryKey}
    />
  );
}
