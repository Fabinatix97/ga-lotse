/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useFileApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export function useGetFile(fileId: string) {
  const fileApi = useFileApi();
  return useSuspenseQuery({
    queryFn: () => fileApi.getFile(fileId),
    queryKey: measlesProtectionApiQueryKey(["files", "get", fileId]),
  });
}
