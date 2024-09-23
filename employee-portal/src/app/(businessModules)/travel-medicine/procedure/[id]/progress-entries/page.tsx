/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import { useDownloadTravelMedicineFile } from "@/lib/businessModules/travelMedicine/api/download/files";
import {
  useDecideApprovalRequest,
  useGrantDeletionForAllRequests,
} from "@/lib/businessModules/travelMedicine/api/mutations/approvalRequests";
import {
  useDeleteFile,
  useRequestFileDeletion,
} from "@/lib/businessModules/travelMedicine/api/mutations/files";
import {
  useCreateProgressEntry,
  useDeleteProgressEntry,
  usePatchProgressEntry,
  useRequestProgressEntryDeletion,
} from "@/lib/businessModules/travelMedicine/api/mutations/progressEntries";
import { useGetMetaDataHistory } from "@/lib/businessModules/travelMedicine/api/queries/files";
import {
  useFetchProgressEntries,
  useFetchProgressEntryDetails,
  useGetManualProgressEntryHistory,
} from "@/lib/businessModules/travelMedicine/api/queries/progressEntries";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/travelMedicine/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/travelMedicine/shared/moduleUserGroup";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function TravelMedicineProgressEntries(
  props: ProgressEntriesUrlParams,
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
      leaderRole={ApiUserRole.TravelMedicineLeader}
      useRequestProgressEntryDeletion={useRequestProgressEntryDeletion}
      useRequestFileDeletion={useRequestFileDeletion}
      useDecideApprovalRequest={useDecideApprovalRequest}
      useGrantDeletionForAllRequests={useGrantDeletionForAllRequests}
      useDownloadFile={useDownloadTravelMedicineFile}
      useGetManualProgressEntryHistory={useGetManualProgressEntryHistory}
      useGetMetaDataHistory={useGetMetaDataHistory}
      routes={{
        entryDetails: (procedureId, entryId) =>
          routes.procedures.progressEntries(procedureId).details(entryId),
        progressEntries: (procedureId) =>
          routes.procedures.progressEntries(procedureId).index,
      }}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      groupName={moduleUserGroup.group}
    />
  );
}
