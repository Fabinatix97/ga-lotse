/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiWebSearchRequest,
  DeleteQueryRequest,
  SaveQueryRequest,
  UpdateWebSearchByIdRequest,
  UpdateWebSearchEntryRequest,
} from "@eshg/inspection-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useWebSearchApi } from "@/lib/businessModules/inspection/api/clients";

export function useCreateWebSearch() {
  const webSearchApi = useWebSearchApi();
  return useHandledMutation({
    mutationFn: (req: ApiWebSearchRequest) => webSearchApi.createWebSearch(req),
  });
}

export function useUpdateWebSearch() {
  const webSearchApi = useWebSearchApi();
  return useHandledMutation({
    mutationFn: (req: UpdateWebSearchByIdRequest) =>
      webSearchApi.updateWebSearchByIdRaw(req).then(unwrapRawResponse),
  });
}

export function useDeleteWebSearch() {
  const webSearchApi = useWebSearchApi();
  return useHandledMutation({
    mutationFn: (id: string) => webSearchApi.deleteWebSearchById(id),
  });
}

export function useStartWebSearch() {
  const webSearchApi = useWebSearchApi();
  return useHandledMutation({
    mutationFn: (id: string) => webSearchApi.startWebSearch(id),
  });
}

export function useUpdateWebSearchEntry() {
  const webSearchApi = useWebSearchApi();
  return useHandledMutation({
    mutationFn: (req: UpdateWebSearchEntryRequest) =>
      webSearchApi.updateWebSearchEntryRaw(req).then(unwrapRawResponse),
  });
}

export function useSaveWebSearchQuery() {
  const webSearchApi = useWebSearchApi();
  return useHandledMutation({
    mutationFn: (req: SaveQueryRequest) =>
      webSearchApi.saveQueryRaw(req).then(unwrapRawResponse),
  });
}

export function useDeleteWebSearchQuery() {
  const webSearchApi = useWebSearchApi();
  return useHandledMutation({
    mutationFn: (req: DeleteQueryRequest) =>
      webSearchApi.deleteQueryRaw(req).then(unwrapRawResponse),
  });
}
