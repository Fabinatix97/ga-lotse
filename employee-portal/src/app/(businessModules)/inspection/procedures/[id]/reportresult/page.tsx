/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InspectionTabReportResult } from "@/lib/businessModules/inspection/components/inspection/reportresult/InspectionTabReportResult";

export default function InspectionTabReportResultPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return <InspectionTabReportResult inspectionId={params.id} />;
}
