/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";

import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/measlesProtection/api/clients";
import {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/measlesProtection/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/measlesProtection/shared/moduleUserGroup";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

interface MeaslesProtectionProcedureProgressEntriesPageParams {
  id: string;
}

export default function MeaslesProtectionProcedureDataProgressEntriesTab(
  props: ProgressEntriesUrlParams<MeaslesProtectionProcedureProgressEntriesPageParams>,
) {
  const { params, searchParams } = props;
  const progressEntryApi = useProgressEntryApi();
  const procedureApi = useProcedureApi();
  const fileApi = useFileApi();
  const approvalRequestApi = useApprovalRequestApi();

  return (
    <ProgressEntriesPage
      procedureId={params.id}
      searchParams={searchParams}
      leaderRole={ApiUserRole.MeaslesProtectionLeader}
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
