/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ProgressEntriesPage } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "@/lib/businessModules/schoolEntry/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/schoolEntry/shared/moduleUserGroup";

export default function SchoolEntryProgressEntriesPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = use(props.params);
  const searchParams = use(props.searchParams);
  const progressEntryApi = useProgressEntryApi();
  const procedureApi = useProcedureApi();
  const fileApi = useFileApi();
  const approvalRequestApi = useApprovalRequestApi();

  return (
    <ProgressEntriesPage
      businessModule={ApiBusinessModule.SchoolEntry}
      procedureId={procedureId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.SchoolEntryLeader}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      additionalKeyDocumentTypes={keyDocumentTypes}
      groupName={moduleUserGroup.group}
      progressEntryApi={progressEntryApi}
      procedureApi={procedureApi}
      fileApi={fileApi}
      approvalRequestApi={approvalRequestApi}
      ariaRole="tabpanel"
    />
  );
}
