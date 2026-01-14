/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useQuery } from "@tanstack/react-query";

import { ApiProcedureStatus } from "@eshg/travel-medicine-api";

import { useVaccinationConsultationApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { mapAppointment } from "@/lib/businessModules/travelMedicine/api/models/AppointmentSummary";
import { mapAssignableService } from "@/lib/businessModules/travelMedicine/api/models/AssignableService";
import { vaccinationConsultationApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllProcedureAppointmentSummaries(date: Date) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getAllProcedureAppointmentSummaries",
      date,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getAllProcedureAppointmentSummaries(date),
  });
}

export function useGetAllAssignableServicesQuery(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return queryOptions({
    queryKey: vaccinationConsultationApiQueryKey([
      "getAllAssignableServices",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getAllAssignableServices(procedureId),
    select: (response) => response.assignableServices.map(mapAssignableService),
  });
}

export function useGetVaccinationConsultationDetailsQuery(id: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return queryOptions({
    queryKey: vaccinationConsultationApiQueryKey([
      "getVaccinationConsultationDetails",
      id,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getVaccinationConsultationDetails(id),
  });
}

export function useGetAllAvailableAppointmentsQuery(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return queryOptions({
    queryKey: vaccinationConsultationApiQueryKey([
      "getAllAvailableAppointments",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getAllAvailableAppointments(procedureId),
    select: (response) => response.appointmentSummaryList.map(mapAppointment),
  });
}

export function useGetAllMedicalHistoriesQuery(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return queryOptions({
    queryKey: vaccinationConsultationApiQueryKey([
      "getMedicalHistories",
      procedureId,
    ]),
    queryFn: () => vaccinationConsultationApi.getMedicalHistories(procedureId),
  });
}

export function useGetAllInformationStatementsQuery(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return queryOptions({
    queryKey: vaccinationConsultationApiQueryKey([
      "getInformationStatements",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getInformationStatements(procedureId),
  });
}

export function useGetVaccinationConsultationCertificatesQuery(
  procedureId: string,
) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return queryOptions({
    queryKey: vaccinationConsultationApiQueryKey([
      "getCertificates",
      procedureId,
    ]),
    queryFn: () => vaccinationConsultationApi.getCertificates(procedureId),
  });
}

export function useGetStepsWithAppliedServicesQuery(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return queryOptions({
    queryKey: vaccinationConsultationApiQueryKey([
      "getStepsWithAppliedServices",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getStepsWithAppliedServices(procedureId),
  });
}

export function useGetStatusQuery(procedureId: string) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return queryOptions({
    queryKey: vaccinationConsultationApiQueryKey(["getStatus", procedureId]),
    queryFn: () => vaccinationConsultationApi.getStatus(procedureId),
    gcTime: 60000, // 1 minute cache
  });
}

export function useGetSearchVaccinationConsultationQuery(
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

  return queryOptions({
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
