/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal/api/files/download";

import { useDataExportApi } from "@/lib/businessModules/statistics/api/clients";
import { useDataExportWithSizeCheck } from "@/lib/businessModules/statistics/api/downloads/useDataExportWithSizeCheck";

export function useExportReportData() {
  const dataExportApi = useDataExportApi();
  const { download, downloadContainerRef } = useFileDownload(
    ({ reportId }: { reportId: string }) =>
      dataExportApi.exportReportDataRaw({
        reportId,
      }),
  );

  return useDataExportWithSizeCheck({ download, downloadContainerRef });
}
