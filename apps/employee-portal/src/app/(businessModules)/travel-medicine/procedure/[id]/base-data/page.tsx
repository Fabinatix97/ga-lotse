/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import {
  useGetAllMedicalAssistantsQuery,
  useGetAllPhysiciansQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import { useGetVaccinationConsultationDetailsQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { VaccinationConsultationDetails } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";

export default function VaccinationConsultationDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const [
    { data: detailsResponse },
    { data: allPhysicians },
    { data: allMedicalAssistants },
  ] = useSuspenseQueries({
    queries: [
      useGetVaccinationConsultationDetailsQuery(id),
      useGetAllPhysiciansQuery(),
      useGetAllMedicalAssistantsQuery(),
    ],
  });

  return (
    <VaccinationConsultationDetails
      procedure={detailsResponse}
      allPhysicians={allPhysicians}
      allMedicalAssistants={allMedicalAssistants}
    />
  );
}
