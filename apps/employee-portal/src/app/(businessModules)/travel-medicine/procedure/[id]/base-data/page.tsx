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
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useGetVaccinationConsultationDetailsQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { useGetAllVaccinesQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccines";
import { VaccinationConsultationDetails } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";

export default function VaccinationConsultationDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const [
    { data: detailsResponse },
    { data: allPhysicians },
    { data: allMedicalAssistants },
    { data: allDiseases },
    { data: allVaccines },
  ] = useSuspenseQueries({
    queries: [
      useGetVaccinationConsultationDetailsQuery(id),
      useGetAllPhysiciansQuery(),
      useGetAllMedicalAssistantsQuery(),
      useGetAllDiseasesQuery(),
      useGetAllVaccinesQuery(),
    ],
  });

  return (
    <VaccinationConsultationDetails
      procedure={detailsResponse}
      allPhysicians={allPhysicians}
      allMedicalAssistants={allMedicalAssistants}
      allDiseases={allDiseases}
      allVaccines={allVaccines}
    />
  );
}
