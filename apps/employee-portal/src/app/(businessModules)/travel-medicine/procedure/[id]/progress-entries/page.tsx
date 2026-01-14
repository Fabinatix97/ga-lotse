/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ProgressEntriesPage } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import { EditInspectionRouteParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/travelMedicine/api/clients";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/travelMedicine/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/travelMedicine/shared/moduleUserGroup";

export default function TravelMedicineProgressEntries(
  props: DynamicPageProps<EditInspectionRouteParams>,
) {
  const { id } = use(props.params);
  const searchParams = use(props.searchParams);
  const progressEntryApi = useProgressEntryApi();
  const procedureApi = useProcedureApi();
  const fileApi = useFileApi();
  const approvalRequestApi = useApprovalRequestApi();

  return (
    <ProgressEntriesPage
      businessModule={ApiBusinessModule.TravelMedicine}
      procedureId={id}
      searchParams={searchParams}
      leaderRole={ApiUserRole.TravelMedicineLeader}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      groupName={moduleUserGroup.group}
      progressEntryApi={progressEntryApi}
      procedureApi={procedureApi}
      fileApi={fileApi}
      approvalRequestApi={approvalRequestApi}
    />
  );
}
