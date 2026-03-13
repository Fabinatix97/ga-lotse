/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiInfectionBriefingAppointType,
  InfectionBriefingPublicCitizenApi,
} from "@eshg/infection-briefing-api";
import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";

import { useInfectionBriefingCitizenPublicApi } from "@/lib/businessModules/infectionBriefing/api/clients";
import { infectionBriefingPublicCitizenApiQueryKey } from "@/lib/businessModules/infectionBriefing/api/queries/apiQueryKeys";
import { useLang } from "@/lib/i18n/useLang";
import { OpeningHoursTranslations } from "@/lib/shared/components/ContactAndAvailabilitySheet";

export function useGetLandingPageContentQuery(
  publicCitizenApi: InfectionBriefingPublicCitizenApi,
) {
  const lang = useLang();

  return queryOptions({
    queryKey: infectionBriefingPublicCitizenApiQueryKey([
      "getLandingPageContent",
      lang,
    ]),
    queryFn: () =>
      publicCitizenApi.getLandingPageContent().then((blob) => blob.text()),
  });
}

export function getOpeningHoursQuery(
  publicCitizenApi: InfectionBriefingPublicCitizenApi,
) {
  return queryOptions({
    queryKey: infectionBriefingPublicCitizenApiQueryKey(["getOpeningHours"]),
    queryFn: () => publicCitizenApi.getOpeningHours(),
    select: (openingHours) =>
      openingHours.localizations as OpeningHoursTranslations,
  });
}

function getFreeAppointmentsQuery(
  publicCitizenApi: InfectionBriefingPublicCitizenApi,
) {
  return queryOptions({
    queryKey: infectionBriefingPublicCitizenApiQueryKey([
      "getFreeAppointments",
    ]),
    queryFn: () =>
      publicCitizenApi.getFreeAppointmentsForCitizen(
        ApiInfectionBriefingAppointType.New,
      ),
  });
}

export function useFreeAppointments() {
  const publicCitizenApi = useInfectionBriefingCitizenPublicApi();
  return useSuspenseQuery(getFreeAppointmentsQuery(publicCitizenApi));
}

export function getDepartmentInfoQuery(
  publicCitizenApi: InfectionBriefingPublicCitizenApi,
) {
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: infectionBriefingPublicCitizenApiQueryKey(["getDepartmentInfo"]),
    queryFn: () => publicCitizenApi.getDepartmentInfo(),
  });
}

export function useDepartmentInfo() {
  const publicCitizenApi = useInfectionBriefingCitizenPublicApi();
  return useSuspenseQuery(getDepartmentInfoQuery(publicCitizenApi));
}
