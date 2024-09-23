/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  useFileApi,
  useProgressEntryApi,
} from "@/lib/businessModules/inspection/api/clients";
import {
  useCreateProgressEntryTemplate,
  useDeleteProgressEntryTemplate,
  usePatchProgressEntryTemplate,
  useRequestProgressEntryDeletionTemplate,
} from "@/lib/shared/api/mutations/progressEntries";

export function useCreateProgressEntry() {
  return useCreateProgressEntryTemplate(useProgressEntryApi);
}

export function useDeleteProgressEntry() {
  return useDeleteProgressEntryTemplate(useProgressEntryApi);
}

export function usePatchProgressEntry() {
  return usePatchProgressEntryTemplate(useProgressEntryApi, useFileApi);
}

export function useRequestProgressEntryDeletion() {
  return useRequestProgressEntryDeletionTemplate(useProgressEntryApi);
}
