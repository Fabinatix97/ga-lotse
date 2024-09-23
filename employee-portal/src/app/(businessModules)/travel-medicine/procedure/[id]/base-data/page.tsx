/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { VaccinationConsultationDetails } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";

export default function VaccinationConsultationDetailsPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return <VaccinationConsultationDetails id={params.id} />;
}
