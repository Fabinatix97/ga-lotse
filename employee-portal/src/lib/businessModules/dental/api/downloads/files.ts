/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileApi } from "@/lib/businessModules/dental/api/clients";
import { useDownloadFile } from "@/lib/shared/api/download/files";

export function useDownloadDentalFile() {
  const fileApi = useFileApi();
  return useDownloadFile((fileId: string) =>
    fileApi.downloadFileRaw({ fileId }),
  );
}
