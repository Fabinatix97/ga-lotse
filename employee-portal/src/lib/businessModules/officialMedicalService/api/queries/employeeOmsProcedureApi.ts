/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  EmployeeOmsProcedureApi,
  GetAllEmployeeProceduresRequest,
} from "@eshg/official-medical-service-api";

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

function getProcedureHeaderQuery(
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
  return queryOptions({
    queryKey: employeeOmsProcedureApiQueryKey([
      "getEmployeeProcedureDetails",
      procedureId,
    ]),
    queryFn: () =>
      employeeOmsProcedureApi.getEmployeeProcedureDetails(procedureId),
  });
}

export function useGetAllDocuments(procedureId: string) {
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();
  return queryOptions({
    queryKey: employeeOmsProcedureApiQueryKey(["getAllDocuments", procedureId]),
    queryFn: () => employeeOmsProcedureApi.getAllDocuments(procedureId),
    select: (response) => response.documents,
  });
}

export function useGetAnamnesis(procedureId: string) {
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();
  return queryOptions({
    queryKey: employeeOmsProcedureApiQueryKey(["getAnamnesis", procedureId]),
    queryFn: () => employeeOmsProcedureApi.getAnamnesis(procedureId),
    select: (response) => response,
  });
}
