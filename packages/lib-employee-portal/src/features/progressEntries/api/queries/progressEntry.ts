/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { isDefined, reverse } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import {
  ApiBusinessModule,
  ApiGetProceduresSortOrder,
} from "@eshg/lib-procedures-api";

import { progressEntryApiQueryKey } from "../../../../config/apiQueryKeys";
import { useApi } from "../../../../contexts/api";
import { useHasUserRoleCheck } from "../../../auth/hooks/useAccessControl";
import { useProgressEntriesConfig } from "../../contexts/progressEntries";
import {
  GetHeadersForOfflineCaching,
  ProcedureClient,
  ProgressEntryClient,
} from "../../types/api";
import { HistoryItem, ProgressEntriesFilters } from "../../types/common";

export function useFetchProgressEntries(
  progressEntryApi: ProgressEntryClient,
  procedureApi: ProcedureClient,
  businessModule: ApiBusinessModule,
  procedureId: string,
  leaderRole: ApiUserRole,
  progressEntryFilter: ProgressEntriesFilters,
  groupName: string,
  getHeadersForOfflineCaching?: GetHeadersForOfflineCaching,
) {
  const preCache = isDefined(getHeadersForOfflineCaching);
  const searchParams = Object.fromEntries(useSearchParams().entries());
  const fetchApprovalRequests = useHasUserRoleCheck(leaderRole);

  const sortOrder =
    searchParams.sortOrder === ApiGetProceduresSortOrder.Asc
      ? ApiGetProceduresSortOrder.Asc
      : ApiGetProceduresSortOrder.Desc;

  const { userApi } = useApi();
  return useSuspenseQuery({
    queryKey: progressEntryApiQueryKey([
      "fetchProgressEntries",
      businessModule,
      procedureId,
      searchParams,
      sortOrder,
      ...getQueryKeyInput(progressEntryFilter),
      `${fetchApprovalRequests}`,
      groupName,
      `${preCache}`,
    ]),
    queryFn: async () => {
      const initOverrides = preCache
        ? getHeadersForOfflineCaching(procedureId)
        : undefined;
      const [
        progressEntries,
        files,
        detailedProcedure,
        approvalRequestsResponse,
        usersByGroupResponse,
      ] = await Promise.all([
        progressEntryApi.getProgressEntriesRaw(
          {
            procedureId: procedureId,
            initiatedBy: progressEntryFilter.initiatedBy,
            progressEntryType: progressEntryFilter.progressEntryType,
            progressEntryClass: progressEntryFilter.progressEntryClass,
            pageSize: 200,
            ...searchParams,
            sortOrder,
          },
          initOverrides,
        ),
        procedureApi.getProcedureFileDetails(procedureId, initOverrides),
        procedureApi.getDetailedProcedure(procedureId, initOverrides),
        fetchApprovalRequests
          ? procedureApi.getApprovalRequests(procedureId, initOverrides)
          : undefined,
        userApi.getUsersByGroup(groupName, initOverrides),
      ]);
      return {
        detailedProcedure,
        files: files.fileDetails,
        progressEntries: await progressEntries.value(),
        approvalRequestsResponse: approvalRequestsResponse,
        users: usersByGroupResponse.users,
      };
    },
  });
}

export function useFetchProgressEntryDetails(
  progressEntryApi: ProgressEntryClient,
  businessModule: ApiBusinessModule,
  procedureId: string,
  entryId: string,
  getHeadersForOfflineCaching?: GetHeadersForOfflineCaching,
) {
  const preCache = isDefined(getHeadersForOfflineCaching);
  return useSuspenseQuery({
    queryKey: progressEntryApiQueryKey([
      "fetchProgressEntryDetails",
      businessModule,
      procedureId,
      entryId,
      `${preCache}`,
    ]),
    queryFn: async () => {
      const initOverrides = preCache
        ? getHeadersForOfflineCaching(procedureId)
        : undefined;

      return await progressEntryApi.getProgressEntry(
        procedureId,
        entryId,
        initOverrides,
      );
    },
  });
}

export function useGetManualProgressEntryHistory(
  progressEntryApi: ProgressEntryClient,
  businessModule: ApiBusinessModule,
  entryId: string,
) {
  const { procedureId } = useProgressEntriesConfig();
  return useSuspenseQuery({
    queryKey: progressEntryApiQueryKey([
      "getManualProgressEntryHistory",
      businessModule,
      procedureId,
      entryId,
    ]),
    queryFn: async () =>
      progressEntryApi.getManualProgressEntryHistory(procedureId, entryId),
    select: (response) =>
      isDefined(response.manualProgressEntryHistory)
        ? reverse(
            response.manualProgressEntryHistory.map((item): HistoryItem => {
              return {
                changedAt: item.changedAt,
                text: item.manualProgressEntry?.note,
              };
            }),
          )
        : undefined,
  });
}

function getQueryKeyInput(progressEntryFilter: ProgressEntriesFilters) {
  return [
    Object.fromEntries(progressEntryFilter.initiatedBy?.entries() ?? []),
    Object.fromEntries(progressEntryFilter.progressEntryType?.entries() ?? []),
    Object.fromEntries(progressEntryFilter.progressEntryClass?.entries() ?? []),
  ];
}
