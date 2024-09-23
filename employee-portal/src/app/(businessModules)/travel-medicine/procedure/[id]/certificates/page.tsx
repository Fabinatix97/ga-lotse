/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { VaccinationConsultationCertificatesForm } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/VaccinationConsultationCertificatesForm";

export default function VaccinationConsultationCertificatesPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return <VaccinationConsultationCertificatesForm procedureId={params.id} />;
}
