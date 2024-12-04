/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import { SchoolEntryProcedurePageParams } from "@/app/(businessModules)/school-entry/procedures/[procedureId]/layout";
import { useDownloadSchoolEntryFile } from "@/lib/businessModules/schoolEntry/api/download/files";
import {
  useDecideApprovalRequest,
  useGrantDeletionForAllRequests,
} from "@/lib/businessModules/schoolEntry/api/mutations/approvalRequests";
import {
  useDeleteFile,
  useRequestFileDeletion,
} from "@/lib/businessModules/schoolEntry/api/mutations/files";
import {
  useCreateProgressEntry,
  useDeleteProgressEntry,
  usePatchProgressEntry,
  useRequestProgressEntryDeletion,
} from "@/lib/businessModules/schoolEntry/api/mutations/progressEntries";
import { useGetMetaDataHistory } from "@/lib/businessModules/schoolEntry/api/queries/files";
import {
  useFetchProgressEntries,
  useFetchProgressEntryDetails,
  useGetManualProgressEntryHistory,
} from "@/lib/businessModules/schoolEntry/api/queries/progressEntries";
import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "@/lib/businessModules/schoolEntry/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/schoolEntry/shared/moduleUserGroup";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

interface SchoolEntryProgressEntriesPageParams
  extends SchoolEntryProcedurePageParams {
  progressEntryId?: string;
}

export default function SchoolEntryProgressEntriesPage(
  props: ProgressEntriesUrlParams<SchoolEntryProgressEntriesPageParams>,
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
      procedureId={params.procedureId}
      progressEntryId={params.progressEntryId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.SchoolEntryLeader}
      useRequestProgressEntryDeletion={useRequestProgressEntryDeletion}
      useRequestFileDeletion={useRequestFileDeletion}
      useDecideApprovalRequest={useDecideApprovalRequest}
      useGrantDeletionForAllRequests={useGrantDeletionForAllRequests}
      useDownloadFile={useDownloadSchoolEntryFile}
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
      additionalKeyDocumentTypes={keyDocumentTypes}
      groupName={moduleUserGroup.group}
    />
  );
}
