/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAlert } from "@eshg/lib-portal";

export function useDataExportWithSizeCheck<TParams>({
  download,
}: {
  download: (params: TParams) => Promise<void>;
}) {
  const { error } = useAlert();

  async function downloadWithSideCheck(
    downloadParams: TParams,
    checkParams: { tooMuchDataForExport: boolean },
  ): Promise<void> {
    if (checkParams.tooMuchDataForExport) {
      error({
        title: "Datenexport nicht möglich",
        message: "Die Datenmenge ist zu groß, um sie zu exportieren.",
        closeable: true,
      });
    } else {
      return download(downloadParams);
    }
  }

  return { download: downloadWithSideCheck };
}
