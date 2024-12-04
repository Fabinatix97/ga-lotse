/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import { OfficialMedicalServiceDetailsPageParams } from "@/app/(businessModules)/official-medical-service/procedures/[id]/layout";
import { useDownloadOfficialMedicalFileFile } from "@/lib/businessModules/officialMedicalService/api/download/files";
import {
  useDecideApprovalRequest,
  useGrantDeletionForAllRequests,
} from "@/lib/businessModules/officialMedicalService/api/mutations/approvalRequests";
import {
  useDeleteFile,
  useRequestFileDeletion,
} from "@/lib/businessModules/officialMedicalService/api/mutations/files";
import {
  useCreateProgressEntry,
  useDeleteProgressEntry,
  usePatchProgressEntry,
  useRequestProgressEntryDeletion,
} from "@/lib/businessModules/officialMedicalService/api/mutations/progressEntries";
import { useGetMetaDataHistory } from "@/lib/businessModules/officialMedicalService/api/queries/files";
import {
  useFetchProgressEntries,
  useFetchProgressEntryDetails,
  useGetManualProgressEntryHistory,
} from "@/lib/businessModules/officialMedicalService/api/queries/progressEntries";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/officialMedicalService/shared/moduleUserGroup";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

interface OfficialMedicalServiceProgressEntriesPageParams
  extends OfficialMedicalServiceDetailsPageParams {
  entryId?: string;
}

export default function OfficialMedicalServiceProgressEntries(
  props: ProgressEntriesUrlParams<OfficialMedicalServiceProgressEntriesPageParams>,
) {
  const { params, searchParams } = props;
  return (
    <ProgressEntriesPage
      useCreateProgressEntry={useCreateProgressEntry}
      useDeleteFile={useDeleteFile}
      useDeleteProgressEntry={useDeleteProgressEntry}
      usePatchProgressEntry={usePatchProgressEntry}
      useFetchProgressEntries={useFetchProgressEntries}
      useFetchProgressEntryDetails={useFetchProgressEntryDetails}
      procedureId={params.id}
      progressEntryId={params.entryId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.OfficialMedicalServiceLeader}
      useRequestProgressEntryDeletion={useRequestProgressEntryDeletion}
      useRequestFileDeletion={useRequestFileDeletion}
      useDecideApprovalRequest={useDecideApprovalRequest}
      useGrantDeletionForAllRequests={useGrantDeletionForAllRequests}
      useDownloadFile={useDownloadOfficialMedicalFileFile}
      useGetManualProgressEntryHistory={useGetManualProgressEntryHistory}
      useGetMetaDataHistory={useGetMetaDataHistory}
      routes={{
        entryDetails: (procedureId, entryId) =>
          routes.procedures.byId(procedureId).progressEntries.byId(entryId)
            .details,
        progressEntries: (procedureId) =>
          routes.procedures.byId(procedureId).progressEntries.index,
      }}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      groupName={moduleUserGroup.group}
    />
  );
}
