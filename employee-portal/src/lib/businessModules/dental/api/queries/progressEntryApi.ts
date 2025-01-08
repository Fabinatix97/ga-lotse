/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import {
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/dental/api/clients";
import {
  useFetchProgressEntriesTemplate,
  useFetchProgressEntryDetailsTemplate,
  useGetManualProgressEntryHistoryTemplate,
} from "@/lib/shared/api/queries/progressEntries";
import { ProgressEntriesFilters } from "@/lib/shared/components/procedures/progress-entries/types";

import { progressEntryApiQueryKey } from "./apiQueryKeys";

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
