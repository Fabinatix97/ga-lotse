/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  EmployeeOmsProcedureApi,
  GetAllEmployeeProceduresRequest,
} from "@eshg/employee-portal-api/officialMedicalService";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useEmployeeOmsProcedureApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { employeeOmsProcedureApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

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

export function useGetProcedureHeader(procedureId: string) {
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();
  return useSuspenseQuery(
    getProcedureHeaderQuery(employeeOmsProcedureApi, procedureId),
  );
}

export function getProcedureHeaderQuery(
  employeeOmsProcedureApi: EmployeeOmsProcedureApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: employeeOmsProcedureApiQueryKey([
      "getEmployeeProcedureHeader",
      procedureId,
    ]),
    queryFn: () =>
      employeeOmsProcedureApi.getEmployeeProcedureHeader(procedureId),
  });
}

export function useGetProcedureDetails(procedureId: string) {
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();
  return useSuspenseQuery(
    getProcedureDetailsQuery(employeeOmsProcedureApi, procedureId),
  );
}

export function getProcedureDetailsQuery(
  employeeOmsProcedureApi: EmployeeOmsProcedureApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: employeeOmsProcedureApiQueryKey([
      "getEmployeeProcedureDetails",
      procedureId,
    ]),
    queryFn: () =>
      employeeOmsProcedureApi.getEmployeeProcedureDetails(procedureId),
  });
}
