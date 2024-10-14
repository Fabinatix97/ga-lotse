/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureStatus } from "@eshg/employee-portal-api/travelMedicine";
import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { useVaccinationConsultationApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { mapAppointment } from "@/lib/businessModules/travelMedicine/api/models/AppointmentSummary";
import { mapAssignableService } from "@/lib/businessModules/travelMedicine/api/models/AssignableService";
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

export function useGetAllAssignableServices(
  procedureId: string,
  open: boolean,
) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledBackgroundQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getAllAssignableServices",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getAllAssignableServices(procedureId),
    select: (response) => response.assignableServices.map(mapAssignableService),
    enabled: open,
    gcTime: 60000,
    staleTime: 60000,
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

export function useGetAllAvailableAppointmentsUnsuspended(
  procedureId: string,
  open: boolean,
) {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useHandledBackgroundQuery({
    queryKey: vaccinationConsultationApiQueryKey([
      "getAllAvailableAppointments",
      procedureId,
    ]),
    queryFn: () =>
      vaccinationConsultationApi.getAllAvailableAppointments(procedureId),
    select: (response) => response.appointmentSummaryList.map(mapAppointment),
    enabled: procedureId.length > 0 && open,
    gcTime: 60000,
    staleTime: 60000,
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
