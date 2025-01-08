/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { fileApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { useGetMetaDataHistoryTemplate } from "@/lib/shared/api/queries/files";

export function useGetMetaDataHistory(fileId: string) {
  return useGetMetaDataHistoryTemplate(useFileApi, fileApiQueryKey, fileId);
}
