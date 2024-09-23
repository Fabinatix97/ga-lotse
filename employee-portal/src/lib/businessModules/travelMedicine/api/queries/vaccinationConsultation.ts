/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureStatus } from "@eshg/employee-portal-api/travelMedicine";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useVaccinationConsultationApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { vaccinationConsultationApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllProcedureAppointmentSummaries(
  dateRangeStart: Date,
  dateRangeEnd: Date,
) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getAllProcedureAppointmentSummaries",
      dateRangeStart,
      dateRangeEnd,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getAllProcedureAppointmentSummaries(
        dateRangeStart,
        dateRangeEnd,
      ),
  });
}

export function useGetAllAssignableServices(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useSuspenseQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getAllAssignableServices",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getAllAssignableServices(procedureId),
  });
}

export function useGetVaccinationConsultationDetails(id: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useSuspenseQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getVaccinationConsultationDetails",
      id,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getVaccinationConsultationDetails(id),
  });
}

export function useGetAllAvailableAppointments(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getAllAvailableAppointments",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getAllAvailableAppointments(procedureId),
  });
}
export function useGetAllMedicalHistories(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useSuspenseQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getMedicalHistories",
      procedureId,
    ]),
    queryFn: () => vaccinationConsultationApi.getMedicalHistories(procedureId),
  });
}

export function useGetVaccinationConsultationCertificates(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getCertificates",
      procedureId,
    ]),
    queryFn: () => vaccinationConsultationApi.getCertificates(procedureId),
  });
}

export function useGetStepsWithAppliedServices(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useSuspenseQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getStepsWithAppliedServices",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getStepsWithAppliedServices(procedureId),
  });
}

export function useGetStatus(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useSuspenseQuery({
    queryKey: vaccinationConsultationApiQueryKey(["getStatus", procedureId]),
    queryFn: () => vaccinationConsultationApi.getStatus(procedureId),
  });
}

export function useGetSearchVaccinationConsultation(
  lastName?: string,
  firstName?: string,
  dateOfBirth?: Date,
  procedureStatus?: ApiProcedureStatus,
) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  const shouldFetch =
    (lastName && lastName.length >= 2) ??
    (firstName && firstName.length >= 2) ??
    dateOfBirth !== undefined;

  return useSuspenseQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "searchVaccinationConsultation",
      firstName,
      lastName,
      dateOfBirth,
      procedureStatus,
      shouldFetch,
    ]),
    queryFn: () =>
      shouldFetch
        ? vaccinationConsultationApi.searchVaccinationConsultation(
            firstName,
            lastName,
            dateOfBirth,
            procedureStatus,
          )
        : Promise.resolve({ vaccinationConsultations: [] }),
  });
}
