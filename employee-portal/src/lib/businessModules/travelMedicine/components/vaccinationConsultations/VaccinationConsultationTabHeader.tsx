/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PersonToolbarHeader } from "@eshg/lib-employee-portal";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetVaccinationConsultationDetailsQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";

export function VaccinationConsultationTabHeader({
  id,
}: {
  readonly id: string;
}) {
  const [{ data: detailsResponse }] = useSuspenseQueries({
    queries: [useGetVaccinationConsultationDetailsQuery(id)],
  });
  return <PersonToolbarHeader person={detailsResponse.patient} showAge />;
}
