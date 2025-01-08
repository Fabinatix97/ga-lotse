/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal/api/files/download";

import { useDataExportApi } from "@/lib/businessModules/statistics/api/clients";
import { useDataExportWithSizeCheck } from "@/lib/businessModules/statistics/api/downloads/useDataExportWithSizeCheck";

export function useExportEvaluationData() {
  const dataExportApi = useDataExportApi();
  const { download, downloadContainerRef } = useFileDownload(
    ({ evaluationId }: { evaluationId: string }) =>
      dataExportApi.exportEvaluationDataRaw({
        evaluationId,
      }),
  );

  return useDataExportWithSizeCheck({ download, downloadContainerRef });
}
