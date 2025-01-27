/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiImportStatistics, ImportXlsxRequest } from "@eshg/dental-api";
import { parseImportResult } from "@eshg/lib-employee-portal/helpers/import";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useDentalApi } from "@/shared/DentalProvider";

export function useImportChildren() {
  const { childApi } = useDentalApi();
  return useHandledMutation({
    mutationFn: (request: ImportXlsxRequest) =>
      childApi
        .importXlsxRaw(request)
        .then(parseImportResult<ApiImportStatistics>),
  });
}
