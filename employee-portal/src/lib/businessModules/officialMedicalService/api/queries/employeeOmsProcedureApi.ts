/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetAllEmployeeProceduresRequest } from "@eshg/employee-portal-api/officialMedicalService";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions } from "@tanstack/react-query";

import { useEmployeeOmsProcedureApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { employeeOmsProcedureApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/queryKeys";

export function useGetAllProceduresQuery(
  request: GetAllEmployeeProceduresRequest,
) {
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return queryOptions({
    queryKey: employeeOmsProcedureApiQueryKey([
      "getAllEmployeeProceduresRaw",
      request,
    ]),
    queryFn: () =>
      employeeOmsProcedureApi
        .getAllEmployeeProceduresRaw(request)
        .then(unwrapRawResponse),
  });
}
