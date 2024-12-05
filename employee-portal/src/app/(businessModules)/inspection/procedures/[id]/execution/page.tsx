/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InspectionTabExecution } from "@/lib/businessModules/inspection/components/inspection/execution/InspectionTabExecution";

export default function InspectionTabExecutionPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return <InspectionTabExecution inspectionId={params.id} />;
}
