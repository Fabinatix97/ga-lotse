/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import { fileApiQueryKey } from "@/lib/businessModules/medicalRegistry/api/queries/apiQueryKeys";
import { useDownloadFile } from "@/lib/shared/api/download/files";
import { useGetMetaDataHistoryTemplate } from "@/lib/shared/api/queries/files";

export function useGetMetaDataHistory(fileId: string) {
  return useGetMetaDataHistoryTemplate(useFileApi, fileApiQueryKey, fileId);
}

export function useDownloadMedicalRegistryFile() {
  const fileApi = useFileApi();
  return useDownloadFile((fileId: string) =>
    fileApi.downloadFileRaw({ fileId }),
  );
}
