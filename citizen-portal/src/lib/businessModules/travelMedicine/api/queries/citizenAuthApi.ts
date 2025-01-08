/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useCitizenAuthApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { citizenAuthApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/apiQueryKeys";

export function useGetProcedureAppointments() {
  const citizenAuthApi = useCitizenAuthApi();
  return useSuspenseQuery({
    queryKey: citizenAuthApiQueryKey(["getProcedureAppointments"]),
    queryFn: () => citizenAuthApi.getProcedureAppointments(),
  });
}

export function useGetProcedureStepAppointmentDetails(
  procedureId: string,
  procedureStepId: string,
) {
  const citizenAuthApi = useCitizenAuthApi();
  return useSuspenseQuery({
    queryKey: citizenAuthApiQueryKey([
      "getProcedureStepAppointmentDetails",
      procedureId,
      procedureStepId,
    ]),
    queryFn: () =>
      citizenAuthApi.getProcedureStepAppointmentDetails(
        procedureId,
        procedureStepId,
      ),
  });
}

export function useGetMedicalHistory(
  procedureId: string,
  procedureStepId: string,
) {
  const citizenAuthApi = useCitizenAuthApi();
  return useSuspenseQuery({
    queryKey: citizenAuthApiQueryKey([
      "getMedicalHistory",
      procedureId,
      procedureStepId,
    ]),
    queryFn: () =>
      citizenAuthApi.getMedicalHistory(procedureId, procedureStepId),
  });
}

export function useGetInformationStatement(informationStatementId: string) {
  const citizenAuthApi = useCitizenAuthApi();
  return useSuspenseQuery({
    queryKey: citizenAuthApiQueryKey([
      "getInformationStatement",
      informationStatementId,
    ]),
    queryFn: () =>
      citizenAuthApi.getCitizenInformationStatement(informationStatementId),
  });
}
