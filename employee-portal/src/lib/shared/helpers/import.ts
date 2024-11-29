/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiResponse } from "@eshg/employee-portal-api/base";

export interface ImportDataResult<TStatistics> {
  file: File;
  statistics: TStatistics;
}

/**
 * We parse the response manually, because it was not possible to strictly type the multipart-part content
 */
export async function parseImportResult<TStatistics>(
  response: ApiResponse<object>,
): Promise<ImportDataResult<TStatistics>> {
  const formData = await response.raw.formData();
  const file = formData.get("file");
  const statisticsJson = formData.get("statistics");

  if (!(file instanceof File && typeof statisticsJson === "string")) {
    throw new Error("Response contains invalid import result.");
  }

  const statistics = JSON.parse(statisticsJson) as TStatistics;
  return {
    file,
    statistics,
  };
}

function formatCount(
  count: number,
  singularLabel: string,
  pluralLabel: string,
) {
  if (count === 1) {
    return `${count} ${singularLabel}`;
  }

  return `${count} ${pluralLabel}`;
}

export function formatImportedCount(count: number) {
  return formatCount(count, "Vorgang", "Vorgänge");
}

export function formatDuplicatedCount(count: number) {
  return formatCount(count, "doppelter Datensatz", "doppelte Datensätze");
}

export function formatFailedCount(count: number) {
  return formatCount(count, "fehlerhafter Datensatz", "fehlerhafte Datensätze");
}

export function formatTotalCount(count: number) {
  return formatCount(count, "Datensatz", "Datensätze");
}
