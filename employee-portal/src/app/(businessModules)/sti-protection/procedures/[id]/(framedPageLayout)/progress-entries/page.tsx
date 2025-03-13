/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { StiProtectionProcedureRouteParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(framedPageLayout)/layout";
import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/stiProtection/api/clients";
import {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/stiProtection/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/stiProtection/shared/moduleUserGroup";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";

export default function StiProtectionProcedureProgressEntriesTab(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id } = props.params;
  const searchParams = props.searchParams;
  const progressEntryApi = useProgressEntryApi();
  const procedureApi = useProcedureApi();
  const fileApi = useFileApi();
  const approvalRequestApi = useApprovalRequestApi();

  return (
    <ProgressEntriesPage
      procedureId={id}
      searchParams={searchParams}
      leaderRole={ApiUserRole.StiProtectionLeader}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
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
