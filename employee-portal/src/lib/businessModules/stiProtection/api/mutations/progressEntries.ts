/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  useFileApi,
  useProgressEntryApi,
} from "@/lib/businessModules/stiProtection/api/clients";
import { progressEntryApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import {
  useCreateProgressEntryTemplate,
  useDeleteProgressEntryTemplate,
  usePatchProgressEntryTemplate,
  useRequestProgressEntryDeletionTemplate,
} from "@/lib/shared/api/mutations/progressEntries";

export function useCreateProgressEntry() {
  return useCreateProgressEntryTemplate(
    useProgressEntryApi,
    progressEntryApiQueryKey([]),
  );
}

export function useDeleteProgressEntry() {
  return useDeleteProgressEntryTemplate(
    useProgressEntryApi,
    progressEntryApiQueryKey([]),
  );
}

export function usePatchProgressEntry() {
  return usePatchProgressEntryTemplate(
    useProgressEntryApi,
    useFileApi,
    progressEntryApiQueryKey([]),
  );
}

export function useRequestProgressEntryDeletion() {
  return useRequestProgressEntryDeletionTemplate(
    useProgressEntryApi,
    progressEntryApiQueryKey([]),
  );
}
