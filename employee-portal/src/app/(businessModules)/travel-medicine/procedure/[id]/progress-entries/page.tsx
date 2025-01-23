/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";

import { EditInspectionPageParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
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
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function TravelMedicineProgressEntries(
  props: ProgressEntriesUrlParams<EditInspectionPageParams>,
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
      searchParams={searchParams}
      leaderRole={ApiUserRole.TravelMedicineLeader}
      useRequestProgressEntryDeletion={useRequestProgressEntryDeletion}
      useRequestFileDeletion={useRequestFileDeletion}
      useDecideApprovalRequest={useDecideApprovalRequest}
      useGrantDeletionForAllRequests={useGrantDeletionForAllRequests}
      useDownloadFile={useDownloadTravelMedicineFile}
      useGetManualProgressEntryHistory={useGetManualProgressEntryHistory}
      useGetMetaDataHistory={useGetMetaDataHistory}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      groupName={moduleUserGroup.group}
    />
  );
}
