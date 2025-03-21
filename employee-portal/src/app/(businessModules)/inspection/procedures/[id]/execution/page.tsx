/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionPhase } from "@eshg/inspection-api";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";

import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { InspectionTabDisabled } from "@/lib/businessModules/inspection/components/inspection/common/InspectionTabDisabled";
import { InspectionTabExecution } from "@/lib/businessModules/inspection/components/inspection/execution/InspectionTabExecution";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";

export default function InspectionTabExecutionPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const { data: inspection } = useGetInspection(id);

  const disabled = inspectionIsBeforePhase(
    inspection.phase,
    ApiInspectionPhase.ReadyForExecution,
  );

  if (disabled) {
    return (
      <InspectionTabDisabled
        message={
          "Um eine Begehung durchzuführen, müssen alle Angaben innerhalb der Planung vollständig sein."
        }
        margin={0}
      />
    );
  }

  return <InspectionTabExecution inspection={inspection} />;
}
