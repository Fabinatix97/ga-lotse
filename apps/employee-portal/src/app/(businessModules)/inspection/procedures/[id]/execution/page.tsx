/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { ApiInspectionPhase } from "@eshg/inspection-api";
import { DynamicPageProps } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionTabDisabled } from "@/lib/businessModules/inspection/components/inspection/common/InspectionTabDisabled";
import { InspectionTabExecution } from "@/lib/businessModules/inspection/components/inspection/execution/InspectionTabExecution";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";

export default function InspectionTabExecutionPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const userApi = useUserApi();
  const inspectionApi = useInspectionApi();
  const [{ data: inspection }, { data: selfUser }] = useSuspenseQueries({
    queries: [getInspectionQuery(inspectionApi, id), getSelfUserQuery(userApi)],
  });

  const disabled = inspectionIsBeforePhase(
    inspection.phase,
    ApiInspectionPhase.ReadyForExecution,
  );

  const message =
    "Um eine Begehung durchzuführen, müssen alle Angaben innerhalb der Planung vollständig sein" +
    (inspection.assignee
      ? "."
      : " und die Begehung muss eine:r Bearbeiter:in zugewiesen sein.");

  if (disabled) {
    return (
      <InspectionTabDisabled
        message={message}
        margin={0}
        procedureId={id}
        selfUserId={!inspection.assignee ? selfUser.userId : undefined}
      />
    );
  }

  return <InspectionTabExecution inspection={inspection} />;
}
