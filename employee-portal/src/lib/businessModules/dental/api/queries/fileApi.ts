/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileApi } from "@/lib/businessModules/dental/api/clients";
import { useGetMetaDataHistoryTemplate } from "@/lib/shared/api/queries/files";

import { fileApiQueryKey } from "./apiQueryKeys";

export function useGetMetaDataHistory(fileId: string) {
  return useGetMetaDataHistoryTemplate(useFileApi, fileApiQueryKey, fileId);
}
