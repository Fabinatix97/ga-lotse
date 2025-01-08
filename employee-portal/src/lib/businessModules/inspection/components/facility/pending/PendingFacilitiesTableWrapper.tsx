/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PendingFacilitiesTable } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesTable";
import { PendingFacilitiesFilters } from "@/lib/businessModules/inspection/shared/types";

export function PendingFacilitiesTableWrapper(
  props: Readonly<{ filter: PendingFacilitiesFilters }>,
) {
  return <PendingFacilitiesTable {...props}></PendingFacilitiesTable>;
}
