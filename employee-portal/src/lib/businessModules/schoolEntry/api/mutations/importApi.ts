/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiImportStatistics,
  ImportCitizenListRequest,
  ImportPastProcedureListRequest,
  ImportSchoolListRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";

import { useImportApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { ImportDataValues } from "@/lib/businessModules/schoolEntry/features/procedures/importData/ImportDataSidebar";
import { ImportListType } from "@/lib/businessModules/schoolEntry/features/procedures/importData/importTypes";
import { parseImportResult } from "@/lib/shared/helpers/import";

export function useImportData() {
  const importApi = useImportApi();
  return useHandledMutation({
    mutationFn: (values: ImportDataValues) =>
      values.listType === ImportListType.SchoolList
        ? importApi
            .importSchoolListRaw(mapSchoolFormValues(values))
            .then(parseImportResult<ApiImportStatistics>)
        : values.listType === ImportListType.CitizenList
          ? importApi
              .importCitizenListRaw(mapCitizenFormValues(values))
              .then(parseImportResult<ApiImportStatistics>)
          : importApi
              .importPastProcedureListRaw(mapPastProcedureFormValues(values))
              .then(parseImportResult<ApiImportStatistics>),
  });
}

function mapCitizenFormValues(
  values: ImportDataValues,
): ImportCitizenListRequest {
  return {
    file: mapRequiredValue(values.file),
    schoolYear: mapRequiredValue(values.schoolYear),
  };
}

function mapSchoolFormValues(
  values: ImportDataValues,
): ImportSchoolListRequest {
  return {
    ...mapCitizenFormValues(values),
    schoolId: mapRequiredValue(values.school).id,
    locationId: mapOptionalValue(values.location)?.id,
  };
}

function mapPastProcedureFormValues(
  values: ImportDataValues,
): ImportPastProcedureListRequest {
  return {
    ...mapCitizenFormValues(values),
    schoolId: mapRequiredValue(values.school).id,
  };
}
