/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";

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
import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/officialMedicalService/shared/moduleUserGroup";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";

export default function OfficialMedicalServiceProgressEntries(
  props: DynamicPageProps<OfficialMedicalServiceDetailsRouteParamsSchema>,
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
