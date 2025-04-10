/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { childApiQueryKey, useDentalApi } from "@eshg/dental";
import { ProcedureLabelsPage } from "@eshg/lib-employee-portal";

export default function LabelsOverviewPage() {
  const { procedureLabelApi } = useDentalApi();

  return (
    <ProcedureLabelsPage
      procedureLabelApi={procedureLabelApi}
      procedureLabelApiQueryKey={childApiQueryKey}
    />
  );
}
