/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ApiInspectionPhase } from "@eshg/inspection-api";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { InspectionTabDisabled } from "@/lib/businessModules/inspection/components/inspection/common/InspectionTabDisabled";
import { InspectionTabReportResult } from "@/lib/businessModules/inspection/components/inspection/reportresult/InspectionTabReportResult";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";

export default function InspectionTabReportResultPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const { data: inspection } = useGetInspection(id);

  const disabled = inspectionIsBeforePhase(
    inspection.phase,
    ApiInspectionPhase.CreatingReportAndInvoice,
  );

  if (disabled) {
    return (
      <InspectionTabDisabled
        message="Um einen Bericht zu erstellen, muss eine Begehung abgeschlossen sein."
        margin={24}
        procedureId={id}
      />
    );
  }

  return <InspectionTabReportResult inspectionId={id} />;
}
