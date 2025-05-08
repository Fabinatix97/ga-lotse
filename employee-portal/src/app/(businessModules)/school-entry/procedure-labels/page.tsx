/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  ProcedureLabelsPage,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";

import { useLabelApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export default function LabelsOverviewPage() {
  const labelApi = useLabelApi();
  const canUserWrite = useHasUserRoleCheck(ApiUserRole.SchoolEntryLeader);

  return (
    <ProcedureLabelsPage
      procedureLabelApi={labelApi}
      procedureLabelApiQueryKey={schoolEntryApiQueryKey}
      hasReadOnlyProcedureLabels
      canUserWrite={canUserWrite}
    />
  );
}
