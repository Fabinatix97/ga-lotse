/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  GetArchivableProceduresRequest,
  GetRelevantArchivableProceduresRequest,
} from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/stiProtection/api/clients";
import { archivingApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import {
  useGetArchivableProceduresTemplate,
  useGetArchivingConfigurationTemplate,
  useGetRelevantArchivableProceduresTemplate,
} from "@/lib/shared/api/queries/archiving";

export function useGetArchivingConfiguration() {
  return useGetArchivingConfigurationTemplate(
    useArchivingApi,
    archivingApiQueryKey,
  );
}
export function useGetArchivableProcedures(
  request: GetArchivableProceduresRequest,
) {
  return useGetArchivableProceduresTemplate(
    useArchivingApi,
    archivingApiQueryKey,
    request,
  );
}

export function useGetRelevantArchivableProcedures(
  request: GetRelevantArchivableProceduresRequest,
) {
  return useGetRelevantArchivableProceduresTemplate(
    useArchivingApi,
    archivingApiQueryKey,
    request,
  );
}
