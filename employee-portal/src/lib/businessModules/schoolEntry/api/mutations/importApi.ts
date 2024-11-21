/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiImportStatistics,
  ApiResponse,
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

interface ImportDataResult {
  file: File;
  statistics: ApiImportStatistics;
}

export function useImportData() {
  const importApi = useImportApi();
  return useHandledMutation({
    mutationFn: (values: ImportDataValues) =>
      values.listType === ImportListType.SchoolList
        ? importApi
            .importSchoolListRaw(mapSchoolFormValues(values))
            .then(parseImportResult)
        : values.listType === ImportListType.CitizenList
          ? importApi
              .importCitizenListRaw(mapCitizenFormValues(values))
              .then(parseImportResult)
          : importApi
              .importPastProcedureListRaw(mapPastProcedureFormValues(values))
              .then(parseImportResult),
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
    schoolId: mapRequiredValue(values.schoolId),
    locationId: mapOptionalValue(values.locationId),
  };
}

function mapPastProcedureFormValues(
  values: ImportDataValues,
): ImportPastProcedureListRequest {
  return {
    ...mapCitizenFormValues(values),
    schoolId: mapRequiredValue(values.schoolId),
  };
}

/**
 * We parse the response manually, because it was not possible to strictly type the multipart-part content
 */
async function parseImportResult(
  response: ApiResponse<object>,
): Promise<ImportDataResult> {
  const formData = await response.raw.formData();
  const file = formData.get("file");
  const statisticsJson = formData.get("statistics");

  if (!(file instanceof File && typeof statisticsJson === "string")) {
    throw new Error("Response contains invalid import result.");
  }

  const statistics = JSON.parse(statisticsJson) as ApiImportStatistics;
  return {
    file,
    statistics,
  };
}
