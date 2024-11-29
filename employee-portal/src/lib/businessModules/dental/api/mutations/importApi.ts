/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiImportStatistics,
  ImportXlsxRequest,
} from "@eshg/employee-portal-api/dental";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";

import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import { ImportChildrenFormValues } from "@/lib/businessModules/dental/import/ImportChildrenSidebar";
import { parseImportResult } from "@/lib/shared/helpers/import";

export function useImportChildren() {
  const childApi = useChildApi();
  return useHandledMutation({
    mutationFn: (values: ImportChildrenFormValues) =>
      childApi
        .importXlsxRaw(mapImportChildrenFormValues(values))
        .then(parseImportResult<ApiImportStatistics>),
  });
}

function mapImportChildrenFormValues(
  values: ImportChildrenFormValues,
): ImportXlsxRequest {
  return {
    file: mapRequiredValue(values.file),
    institutionId: mapRequiredValue(values.institutionId),
    schoolYear: mapRequiredValue(values.schoolYear),
  };
}
