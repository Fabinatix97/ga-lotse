/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InspectionTabHistory } from "@/lib/businessModules/inspection/components/inspection/history/InspectionTabHistory";

export default function InspectionTabHistoryPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return <InspectionTabHistory inspectionId={params.id} />;
}
