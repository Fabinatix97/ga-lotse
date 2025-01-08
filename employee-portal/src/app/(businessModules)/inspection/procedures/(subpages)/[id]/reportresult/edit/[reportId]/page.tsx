/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { EditInspectionPageParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { InspectionReportEditor } from "@/lib/businessModules/inspection/components/inspection/reportresult/editor/InspectionReportEditor";

interface InspectionReportEditorPageParams extends EditInspectionPageParams {
  reportId: string;
  id: string;
}

export default function InspectionReportEditorPage({
  params,
}: Readonly<{
  params: InspectionReportEditorPageParams;
}>) {
  return (
    <InspectionReportEditor
      reportId={params.reportId}
      inspectionId={params.id}
    />
  );
}
