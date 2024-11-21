/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CertificatesTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/CertificatesTable";

export default function VaccinationConsultationCertificatesPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return <CertificatesTable procedureId={params.id}></CertificatesTable>;
}
