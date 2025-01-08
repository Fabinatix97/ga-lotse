/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InspectionTabBasedata } from "@/lib/businessModules/inspection/components/inspection/basedata/InspectionTabBasedata";

export default function InspectionTabBasedataPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return <InspectionTabBasedata inspectionId={params.id} />;
}
