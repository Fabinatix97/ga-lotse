/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MedicalRegistryProcedureRouteParams } from "@/app/(businessModules)/medical-registry/procedures/[id]/page";
import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/medicalRegistry/api/clients";
import {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "@/lib/businessModules/medicalRegistry/api/queries/apiQueryKeys";
import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "@/lib/businessModules/medicalRegistry/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/medicalRegistry/shared/moduleUserGroup";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";

export default function MedicalRegistryProgressEntriesPage(
  props: DynamicPageProps<MedicalRegistryProcedureRouteParams>,
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
      leaderRole={ApiUserRole.MedicalRegistryLeader}
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
