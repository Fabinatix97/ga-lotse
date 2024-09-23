/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { fileApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";
import { useGetMetaDataHistoryTemplate } from "@/lib/shared/api/queries/files";

export function useGetMetaDataHistory(fileId: string) {
  return useGetMetaDataHistoryTemplate(useFileApi, fileApiQueryKey, fileId);
}
