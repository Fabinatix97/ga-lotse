/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useFileApi } from "@/lib/businessModules/stiProtection/api/clients";
import { fileApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import { useGetMetaDataHistoryTemplate } from "@/lib/shared/api/queries/files";

export function useGetFile(fileId: string) {
  const fileApi = useFileApi();
  return useSuspenseQuery({
    queryFn: () => fileApi.getFile(fileId),
    queryKey: fileApiQueryKey(["get", fileId]),
  });
}

export function useDownloadFile(fileId: string) {
  const fileApi = useFileApi();
  return useSuspenseQuery({
    queryFn: () => fileApi.downloadFile(fileId),
    queryKey: fileApiQueryKey(["download", fileId]),
  });
}

export function useGetMetaDataHistory(fileId: string) {
  return useGetMetaDataHistoryTemplate(useFileApi, fileApiQueryKey, fileId);
}
