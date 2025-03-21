/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";

import { EditInspectionRouteParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/inspection/api/clients";
import {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/inspection/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/inspection/shared/moduleUserGroup";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";

export default function InspectionProgressEntriesPage(
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
      procedureId={id}
      searchParams={searchParams}
      leaderRole={ApiUserRole.InspectionLeader}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      groupName={moduleUserGroup.group}
      getInitOverrides={getHeadersForOfflineCaching}
      progressEntryApiQueryKey={progressEntryApiQueryKey}
      progressEntryApi={progressEntryApi}
      procedureApi={procedureApi}
      fileApiQueryKey={fileApiQueryKey}
      fileApi={fileApi}
      approvalRequestApi={approvalRequestApi}
    />
  );
}
