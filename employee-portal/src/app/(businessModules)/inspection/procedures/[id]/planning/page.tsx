/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InspectionTabPlanning } from "@/lib/businessModules/inspection/components/inspection/planning/InspectionTabPlanning";

export default function InspectionTabPlanningPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return <InspectionTabPlanning inspectionId={params.id} />;
}
