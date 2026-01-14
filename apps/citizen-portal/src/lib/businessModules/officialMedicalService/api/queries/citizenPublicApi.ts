/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useQueryClient } from "@tanstack/react-query";

import {
  SEMI_STATIC_QUERY_OPTIONS,
  durationToMinutes,
  isDateCurrentDateOrGreater,
} from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  type ApiGetFreeAppointmentsResponse,
  ApiOmsAppointmentStandardDurations,
} from "@eshg/official-medical-service-api";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { citizenPublicApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";
import { mapToConcernApiList } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { useLang } from "@/lib/i18n/useLang";

export function useGetAppointmentStandardDurationsQuery() {
  const citizenPublicApi = useCitizenPublicApi();

  return queryOptions({
    queryKey: citizenPublicApiQueryKey([
      "getAppointmentStandardDurationsForCitizen",
    ]),
    queryFn: () => citizenPublicApi.getAppointmentStandardDurationsForCitizen(),
    select: mapAppointmentDurationConfig,
    refetchOnWindowFocus: false,
  });
}

function mapAppointmentDurationConfig(
  response: ApiOmsAppointmentStandardDurations,
): Partial<Record<ApiAppointmentType, number>> {
  return {
    [ApiAppointmentType.OfficialMedicalServiceShort]: durationToMinutes(
      response.officialMedicalServiceShort,
    ),
    [ApiAppointmentType.OfficialMedicalServiceLong]: durationToMinutes(
      response.officialMedicalServiceLong,
    ),
  };
}

export function useGetDepartmentInfoQuery() {
  const departmentApi = useCitizenPublicApi();
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: citizenPublicApiQueryKey(["getDepartmentInfo"]),
    queryFn: () => departmentApi.getDepartmentInfo(),
  });
}

export function useGetOpeningHoursQuery() {
  const departmentApi = useCitizenPublicApi();
  return queryOptions({
    queryKey: citizenPublicApiQueryKey(["getOpeningHours"]),
    queryFn: () => departmentApi.getOpeningHours(),
  });
}

export function useGetFreeAppointmentsForCitizen(
  appointmentType: ApiAppointmentType | undefined,
) {
  const citizenPublicApi = useCitizenPublicApi();

  return queryOptions({
    queryKey: citizenPublicApiQueryKey([
      "getFreeAppointmentsForCitizen",
      appointmentType,
    ]),
    queryFn: async (): Promise<ApiGetFreeAppointmentsResponse> => {
      if (appointmentType === undefined) {
        return {
          appointments: [],
        };
      }
      return citizenPublicApi.getFreeAppointmentsForCitizen(appointmentType);
    },
  });
}

export function useGetFreeAppointmentsForCitizenAfterCurrentDate(
  appointmentType: ApiAppointmentType | undefined,
) {
  return queryOptions({
    ...useGetFreeAppointmentsForCitizen(appointmentType),
    select: (appointments) =>
      appointments.appointments.filter((appointment) =>
        isDateCurrentDateOrGreater(appointment.start),
      ),
  });
}

export function useGetConcerns() {
  const citizenPublicApi = useCitizenPublicApi();
  const lang = useLang();

  return queryOptions({
    queryKey: citizenPublicApiQueryKey(["getVisibleConcerns", lang]),
    queryFn: () => citizenPublicApi.getVisibleConcerns(),
    select: (data) => ({
      concerns: data.categories.flatMap((category) =>
        mapToConcernApiList(category),
      ),
      infobox: data.infobox,
    }),
  });
}

export function useGetLandingContent() {
  const citizenPublicApi = useCitizenPublicApi();
  const lang = useLang();

  return queryOptions({
    queryKey: citizenPublicApiQueryKey(["getLandingContent", lang]),
    queryFn: () => citizenPublicApi.getLandingContent(),
  });
}

export function useBackendFileValidation() {
  const citizenPublicApi = useCitizenPublicApi();
  const queryClient = useQueryClient();

  return (files: Blob[]) => {
    return queryClient.fetchQuery({
      queryKey: citizenPublicApiQueryKey(["validateFiles", files]),
      queryFn: () =>
        citizenPublicApi.validateFiles(files) as Promise<{
          errorMessages: (string | null)[];
        }>,
    });
  };
}
