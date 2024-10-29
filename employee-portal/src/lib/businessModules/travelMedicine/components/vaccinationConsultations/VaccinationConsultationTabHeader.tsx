/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetVaccinationConsultationDetailsQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

export function VaccinationConsultationTabHeader({
  id,
}: {
  readonly id: string;
}) {
  const [{ data: detailsResponse }] = useSuspenseQueries({
    queries: [useGetVaccinationConsultationDetailsQuery(id)],
  });
  const name = formatPersonName(detailsResponse.patient);
  const dateOfBirth = detailsResponse.patient.dateOfBirth;
  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>{name}</TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        Geb. {formatDate(dateOfBirth)}
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        Alter {calculateAge(dateOfBirth)}
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>ID {id}</TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
