/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import { useDownloadStiProtectionFile } from "@/lib/businessModules/stiProtection/api/download/files";
import {
  useDecideApprovalRequest,
  useGrantDeletionForAllRequests,
} from "@/lib/businessModules/stiProtection/api/mutations/approvalRequests";
import {
  useDeleteFile,
  useRequestFileDeletion,
} from "@/lib/businessModules/stiProtection/api/mutations/files";
import {
  useCreateProgressEntry,
  useDeleteProgressEntry,
  usePatchProgressEntry,
  useRequestProgressEntryDeletion,
} from "@/lib/businessModules/stiProtection/api/mutations/progressEntries";
import { useGetMetaDataHistory } from "@/lib/businessModules/stiProtection/api/queries/files";
import {
  useFetchProgressEntries,
  useFetchProgressEntryDetails,
  useGetManualProgressEntryHistory,
} from "@/lib/businessModules/stiProtection/api/queries/progressEntries";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/stiProtection/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/stiProtection/shared/moduleUserGroup";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function StiProtectionProcedureProgressEntriesTab(
  props: Readonly<ProgressEntriesUrlParams>,
) {
  return (
    <ProgressEntriesPage
      useCreateProgressEntry={useCreateProgressEntry}
      useDeleteFile={useDeleteFile}
      useDeleteProgressEntry={useDeleteProgressEntry}
      usePatchProgressEntry={usePatchProgressEntry}
      useFetchProgressEntries={useFetchProgressEntries}
      useFetchProgressEntryDetails={useFetchProgressEntryDetails}
      urlParams={props}
      leaderRole={ApiUserRole.StiProtectionLeader}
      useRequestProgressEntryDeletion={useRequestProgressEntryDeletion}
      useRequestFileDeletion={useRequestFileDeletion}
      useDecideApprovalRequest={useDecideApprovalRequest}
      useGrantDeletionForAllRequests={useGrantDeletionForAllRequests}
      useDownloadFile={useDownloadStiProtectionFile}
      useGetManualProgressEntryHistory={useGetManualProgressEntryHistory}
      useGetMetaDataHistory={useGetMetaDataHistory}
      routes={{
        entryDetails: (procedureId, entryId) =>
          routes.procedures.byId(procedureId).progressEntries.byId(entryId),
        progressEntries: (procedureId) =>
          routes.procedures.byId(procedureId).progressEntries.index,
      }}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      groupName={moduleUserGroup.group}
    />
  );
}
