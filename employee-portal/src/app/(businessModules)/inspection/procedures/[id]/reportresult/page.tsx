/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionPhase } from "@eshg/employee-portal-api/inspection";

import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { InspectionTabDisabled } from "@/lib/businessModules/inspection/components/inspection/common/InspectionTabDisabled";
import { InspectionTabReportResult } from "@/lib/businessModules/inspection/components/inspection/reportresult/InspectionTabReportResult";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";

export default function InspectionTabReportResultPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const { data: inspection } = useGetInspection(params.id);

  const disabled = inspectionIsBeforePhase(
    inspection.phase,
    ApiInspectionPhase.CreatingReportAndInvoice,
  );

  if (disabled) {
    return (
      <InspectionTabDisabled
        message={
          "Um einen Bericht zu erstellen, muss eine Begehung abgeschlossen sein."
        }
        margin={24}
      />
    );
  }

  return <InspectionTabReportResult inspectionId={params.id} />;
}
