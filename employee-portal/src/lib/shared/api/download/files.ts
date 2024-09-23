/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiResponse } from "@eshg/employee-portal-api/businessProcedures";
import { parseBlobResponse } from "@eshg/lib-portal/api/files/download";

/**
 * @deprecated Use `useFileDownload` from lib-portal instead
 */
export function useDownloadFile<TParams extends unknown[]>(
  downloadFileRaw: (...params: TParams) => Promise<ApiResponse<Blob>>,
) {
  return async function (...params: TParams) {
    return parseBlobResponse(await downloadFileRaw(...params));
  };
}
