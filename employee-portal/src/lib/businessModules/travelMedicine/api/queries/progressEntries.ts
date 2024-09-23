/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import {
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/travelMedicine/api/clients";
import { progressEntryApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";
import {
  useFetchProgressEntriesTemplate,
  useFetchProgressEntryDetailsTemplate,
  useGetManualProgressEntryHistoryTemplate,
} from "@/lib/shared/api/queries/progressEntries";
import { ProgressEntriesFilters } from "@/lib/shared/components/procedures/progress-entries/types";

export function useFetchProgressEntries(
  procedureId: string,
  leaderRole: ApiUserRole,
  progressEntryFilter: ProgressEntriesFilters,
) {
  return useFetchProgressEntriesTemplate(
    useProgressEntryApi,
    useProcedureApi,
    progressEntryApiQueryKey,
    procedureId,
    leaderRole,
    progressEntryFilter,
  );
}

export function useFetchProgressEntryDetails(
  procedureId: string,
  entryId: string,
) {
  return useFetchProgressEntryDetailsTemplate(
    useProgressEntryApi,
    progressEntryApiQueryKey,
    procedureId,
    entryId,
  );
}

export function useGetManualProgressEntryHistory(entryId: string) {
  return useGetManualProgressEntryHistoryTemplate(
    useProgressEntryApi,
    progressEntryApiQueryKey,
    entryId,
  );
}
