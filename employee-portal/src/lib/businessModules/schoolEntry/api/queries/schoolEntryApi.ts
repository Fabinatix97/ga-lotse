/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import {
  GetFreeAppointmentsForProcedureRequest,
  GetProceduresRequest,
  GetWaitingRoomProceduresRequest,
  SchoolEntryApi,
} from "@eshg/school-entry-api";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { mapAnamnesis } from "@/lib/businessModules/schoolEntry/api/models/Anamnesis";
import { mapAppointment } from "@/lib/businessModules/schoolEntry/api/models/Appointment";
import { mapProcedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { mapProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { mapVaccinationStatus } from "@/lib/businessModules/schoolEntry/api/models/VaccinationStatus";
import { mapWaitingRoomProcedure } from "@/lib/businessModules/schoolEntry/api/models/WaitingRoom";
import { mapDevelopmentScreeningResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/DevelopmentScreeningResult";
import { mapEyeExaminationResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/EyeExaminationResult";
import { mapHearingTestResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/HearingTestResult";
import { mapSopessExaminationResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/SopessExaminationResult";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function getProceduresQuery(
  schoolEntryApi: SchoolEntryApi,
  request: GetProceduresRequest,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey(["getProcedures", request]),
    queryFn: () =>
      schoolEntryApi.getProceduresRaw(request).then(unwrapRawResponse),
    select: mapPaginatedList(mapProcedure),
  });
}

export function useGetProcedure(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  return useSuspenseQuery(getProcedureQuery(schoolEntryApi, procedureId));
}

export function getProcedureQuery(
  schoolEntryApi: SchoolEntryApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey(["getProcedure", procedureId]),
    queryFn: () => schoolEntryApi.getProcedure(procedureId),
    select: mapProcedureDetails,
  });
}

export function getProceduresByPersonQuery(
  schoolEntryApi: SchoolEntryApi,
  personId: string | undefined,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey(["getProceduresByPerson", personId]),
    queryFn: () =>
      isDefined(personId)
        ? schoolEntryApi
            .getProceduresByPersonQueryRaw({ personId })
            .then(unwrapRawResponse)
        : Promise.reject(new Error("Expected personId to be defined")),
    select: (response) => response.procedures,
    enabled: isDefined(personId),
  });
}

export function useGetFreeAppointmentsForProcedureUnsuspended(
  request: GetFreeAppointmentsForProcedureRequest,
) {
  const schoolEntryApi = useSchoolEntryApi();
  return useHandledBackgroundQuery({
    queryKey: schoolEntryApiQueryKey([
      "getFreeAppointmentsForProcedure",
      request,
    ]),
    queryFn: () =>
      schoolEntryApi
        .getFreeAppointmentsForProcedureRaw(request)
        .then(unwrapRawResponse),
    select: (response) => response.appointments.map(mapAppointment),
  });
}

export function getHearingTestResultQuery(
  schoolEntryApi: SchoolEntryApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey(["getHearingTestResult", procedureId]),
    queryFn: () => schoolEntryApi.getHearingTestResult(procedureId),
    select: mapHearingTestResult,
  });
}

export function getEyeExaminationResultQuery(
  schoolEntryApi: SchoolEntryApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey(["getEyeExaminationResult", procedureId]),
    queryFn: () => schoolEntryApi.getEyeExaminationResult(procedureId),
    select: mapEyeExaminationResult,
  });
}

export function getSopessExaminationResultQuery(
  schoolEntryApi: SchoolEntryApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey([
      "getSopessExaminationResult",
      procedureId,
    ]),
    queryFn: () => schoolEntryApi.getSopessExaminationResult(procedureId),
    select: mapSopessExaminationResult,
  });
}

export function getDevelopmentScreeningResultQuery(
  schoolEntryApi: SchoolEntryApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey([
      "getDevelopmentScreeningResult",
      procedureId,
    ]),
    queryFn: () => schoolEntryApi.getDevelopmentScreeningResult(procedureId),
    select: mapDevelopmentScreeningResult,
  });
}

export function getVaccinationStatusQuery(
  schoolEntryApi: SchoolEntryApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey(["getVaccinationStatus", procedureId]),
    queryFn: () => schoolEntryApi.getVaccinationStatus(procedureId),
    select: mapVaccinationStatus,
  });
}

export function getAnamnesisQuery(
  schoolEntryApi: SchoolEntryApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: schoolEntryApiQueryKey(["getAnamnesis", procedureId]),
    queryFn: () => schoolEntryApi.getAnamnesis(procedureId),
    select: mapAnamnesis,
  });
}

export function useGetWaitingRoomProcedures(
  request: GetWaitingRoomProceduresRequest,
) {
  const schoolEntryApi = useSchoolEntryApi();
  return useSuspenseQuery({
    queryKey: schoolEntryApiQueryKey(["getWaitingRoomProcedures", request]),
    queryFn: () =>
      schoolEntryApi
        .getWaitingRoomProceduresRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapWaitingRoomProcedure),
    refetchInterval: 60_000,
  });
}
