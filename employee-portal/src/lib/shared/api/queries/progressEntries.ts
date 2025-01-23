/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  ApiGetProceduresSortOrder,
  ProcedureApi,
  ProgressEntryApi,
} from "@eshg/employee-portal-api/businessProcedures";
import { type QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { isDefined, reverse } from "remeda";

import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";
import { useProgressEntriesConfig } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import {
  HistoryItem,
  ProgressEntriesFilters,
} from "@/lib/shared/components/procedures/progress-entries/types";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export function useFetchProgressEntriesTemplate(
  useProgressEntryApi: () => Pick<ProgressEntryApi, "getProgressEntriesRaw">,
  useProcedureApi: () => Pick<
    ProcedureApi,
    "getDetailedProcedure" | "getProcedureFileDetails" | "getApprovalRequests"
  >,
  queryKeyFactory: QueryKeyFactory,
  procedureId: string,
  leaderRole: ApiUserRole,
  progressEntryFilter: ProgressEntriesFilters,
  preCache?: boolean,
) {
  const progressEntryApi = useProgressEntryApi();
  const procedureApi = useProcedureApi();
  const searchParams = Object.fromEntries(useSearchParams().entries());
  const fetchApprovalRequests = useHasUserRoleCheck(leaderRole);

  const sortOrder =
    searchParams.sortOrder === ApiGetProceduresSortOrder.Asc
      ? ApiGetProceduresSortOrder.Asc
      : ApiGetProceduresSortOrder.Desc;

  return useSuspenseQuery({
    queryKey: queryKeyFactory([
      "fetchProgressEntries",
      procedureId,
      searchParams,
      sortOrder,
      ...getQueryKeyInput(progressEntryFilter),
      `${fetchApprovalRequests}`,
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
      ]);
      return {
        detailedProcedure,
        files: files.fileDetails,
        progressEntries: (await progressEntries.value()).progressEntries,
        approvalRequestsResponse: approvalRequestsResponse,
      };
    },
  });
}

export function useFetchProgressEntryDetailsTemplate(
  useProgressEntryApi: () => Pick<ProgressEntryApi, "getProgressEntry">,
  queryKeyFactory: QueryKeyFactory,
  procedureId: string,
  entryId: string,
  preCache?: boolean,
) {
  const progressEntryApi = useProgressEntryApi();

  return useSuspenseQuery({
    queryKey: queryKeyFactory([
      "fetchProgressEntryDetails",
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

export function useGetManualProgressEntryHistoryTemplate(
  useProgressEntryApi: () => Pick<
    ProgressEntryApi,
    "getManualProgressEntryHistory"
  >,
  queryKeyFactory: QueryKeyFactory,
  entryId: string,
) {
  const progressEntryApi = useProgressEntryApi();
  const { procedureId } = useProgressEntriesConfig();
  return useSuspenseQuery({
    queryKey: queryKeyFactory([
      "getManualProgressEntryHistory",
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
