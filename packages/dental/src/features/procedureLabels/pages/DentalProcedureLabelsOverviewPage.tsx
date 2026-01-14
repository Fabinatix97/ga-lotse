/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  ProcedureLabelsPage,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";

import { childApiQueryKey } from "../../../config/apiQueryKeys";
import { useDentalApi } from "../../../contexts/dental";

export function DentalProcedureLabelsOverviewPage() {
  const { procedureLabelApi } = useDentalApi();
  const canUserWrite = useHasUserRoleCheck(ApiUserRole.DentalLeader);

  return (
    <ProcedureLabelsPage
      procedureLabelApi={procedureLabelApi}
      procedureLabelApiQueryKey={childApiQueryKey}
      canUserWrite={canUserWrite}
    />
  );
}
