/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiImportStatistics,
  ApiImportStatisticsFromJSON,
  ApiResponse,
  ImportProcessesRequest,
} from "@eshg/inspection-api";
import { useHandledMutation } from "@eshg/lib-portal";

import { useImportApi } from "@/lib/businessModules/inspection/api/clients";

export interface ImportProcessResult {
  file: File;
  statistics: ApiImportStatistics;
}

export function useImportProcess() {
  const importApi = useImportApi();

  return useHandledMutation({
    mutationFn: async (
      request: ImportProcessesRequest,
    ): Promise<ImportProcessResult> => {
      return await importApi
        .importProcessesRaw(request)
        .then(parseImportResult);
    },
  });
}

async function parseImportResult(
  response: ApiResponse<object>,
): Promise<ImportProcessResult> {
  const formData = await response.raw.formData();
  const statisticsStr = formData.get("statistics");
  const file = formData.get("file");

  if (!(file instanceof File && typeof statisticsStr === "string")) {
    throw new Error("Invalid response");
  }

  const statistics = ApiImportStatisticsFromJSON(JSON.parse(statisticsStr));

  return {
    file,
    statistics,
  };
}
