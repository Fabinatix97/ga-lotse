/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiResponse } from "@eshg/base-api";
import {
  ApiImportStatistics,
  ApiImportStatisticsFromJSON,
} from "@eshg/inspection-api";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

import { useMedicalRegistryImportApi } from "@/lib/businessModules/medicalRegistry/api/clients";

export function useImportData() {
  const medicalRegistryImportApi = useMedicalRegistryImportApi();
  const abortControllerRef = useRef<AbortController>();
  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
  }, []);

  const mutation = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      medicalRegistryImportApi
        .importDataRaw({ file }, { signal: abortControllerRef.current?.signal })
        .then(parseImportResult),
  });

  return { ...mutation, abort };
}

interface ImportDataResult {
  file: File;
  statistics: ApiImportStatistics;
}

async function parseImportResult(
  response: ApiResponse<object>,
): Promise<ImportDataResult> {
  const formData = await response.raw.formData();
  const statisticsJson = formData.get("statistics");
  const file = formData.get("file");

  if (!(file instanceof File && typeof statisticsJson === "string")) {
    throw new Error("Invalid response");
  }

  return {
    file,
    statistics: ApiImportStatisticsFromJSON(JSON.parse(statisticsJson)),
  };
}
