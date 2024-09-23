/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { useGetVaccinationConsultationDetails } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { calculateAge } from "@/lib/businessModules/travelMedicine/shared/helper";
import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

export function VaccinationConsultationTabHeader({
  id,
}: {
  readonly id: string;
}) {
  const data = useGetVaccinationConsultationDetails(id).data;
  const name = formatPersonName(data.patient);
  const dateOfBirth = data.patient.dateOfBirth;
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
