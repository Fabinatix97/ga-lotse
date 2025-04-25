/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";
import { isNonNullish } from "remeda";

import { ApiBusinessModule } from "@eshg/base-api";
import { parseOptionalEnum } from "@eshg/lib-portal/helpers/searchParams";
import { ApiOpenDataFileType } from "@eshg/opendata-api";

import {
  SEARCH_PARAMS,
  parseYear,
} from "@/lib/businessModules/opendata/components/helpers";

interface OpenDataFilterValues {
  search: string | undefined;
  topic: ApiBusinessModule[] | undefined;
  year: string | undefined;
  fileType: ApiOpenDataFileType | undefined;
}

export function useOpenDataFilterValues(): OpenDataFilterValues {
  const searchParams = useSearchParams();
  const topics = searchParams
    .getAll(SEARCH_PARAMS.topic)
    .map((value) =>
      parseOptionalEnum<ApiBusinessModule, Record<string, ApiBusinessModule>>(
        ApiBusinessModule,
        value,
      ),
    )
    .filter((value) => isNonNullish(value));

  return {
    [SEARCH_PARAMS.search]: searchParams.get(SEARCH_PARAMS.search) ?? undefined,
    [SEARCH_PARAMS.topic]: topics.length !== 0 ? topics : undefined,
    [SEARCH_PARAMS.year]: parseYear(searchParams.get(SEARCH_PARAMS.year)),
    [SEARCH_PARAMS.fileType]: parseOptionalEnum(
      ApiOpenDataFileType,
      searchParams.get(SEARCH_PARAMS.fileType),
    ),
  };
}
