/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetVaccinationConsultationDetailsQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { VaccinationConsultationDetails } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";

export default function VaccinationConsultationDetailsPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  const [{ data: detailsResponse }] = useSuspenseQueries({
    queries: [useGetVaccinationConsultationDetailsQuery(params.id)],
  });

  return <VaccinationConsultationDetails procedure={detailsResponse} />;
}
