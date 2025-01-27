/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";

import { OfficialMedicalServiceDetailsPageParams } from "@/app/(businessModules)/official-medical-service/procedures/[id]/layout";
import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/officialMedicalService/api/clients";
import {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/officialMedicalService/shared/moduleUserGroup";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function OfficialMedicalServiceProgressEntries(
  props: ProgressEntriesUrlParams<OfficialMedicalServiceDetailsPageParams>,
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
      leaderRole={ApiUserRole.OfficialMedicalServiceLeader}
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
