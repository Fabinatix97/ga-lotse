/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { EditInspectionRouteParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { InspectionReportEditor } from "@/lib/businessModules/inspection/components/inspection/reportresult/editor/InspectionReportEditor";

type InspectionReportEditorRouteParams = EditInspectionRouteParams & {
  reportId: string;
  id: string;
};

export default function InspectionReportEditorPage(
  props: DynamicPageProps<InspectionReportEditorRouteParams>,
) {
  const { id, reportId } = use(props.params);

  return <InspectionReportEditor reportId={reportId} inspectionId={id} />;
}
