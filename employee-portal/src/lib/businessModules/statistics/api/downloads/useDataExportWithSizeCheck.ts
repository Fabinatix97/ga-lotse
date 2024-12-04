/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import { RefObject } from "react";

export function useDataExportWithSizeCheck<TParams>({
  download,
  downloadContainerRef,
}: {
  download: (params: TParams) => Promise<void>;
  downloadContainerRef: RefObject<HTMLDivElement>;
}) {
  const { error } = useAlert();

  async function downlaodWithSideCheck(
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

  return { download: downlaodWithSideCheck, downloadContainerRef };
}
