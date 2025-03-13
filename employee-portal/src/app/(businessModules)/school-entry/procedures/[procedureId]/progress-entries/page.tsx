/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "@/lib/businessModules/schoolEntry/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/schoolEntry/shared/moduleUserGroup";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";

export default function SchoolEntryProgressEntriesPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = props.params;
  const searchParams = props.searchParams;
  const progressEntryApi = useProgressEntryApi();
  const procedureApi = useProcedureApi();
  const fileApi = useFileApi();
  const approvalRequestApi = useApprovalRequestApi();

  return (
    <ProgressEntriesPage
      procedureId={procedureId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.SchoolEntryLeader}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      additionalKeyDocumentTypes={keyDocumentTypes}
      groupName={moduleUserGroup.group}
      progressEntryApiQueryKey={progressEntryApiQueryKey}
      progressEntryApi={progressEntryApi}
      procedureApi={procedureApi}
      fileApiQueryKey={fileApiQueryKey}
      fileApi={fileApi}
      approvalRequestApi={approvalRequestApi}
    />
  );
}
