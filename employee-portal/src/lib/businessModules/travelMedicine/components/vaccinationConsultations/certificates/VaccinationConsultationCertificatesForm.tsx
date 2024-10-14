/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { VaccinationConsultationCertificatesTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/VaccinationConsultationCertificatesTable";

export function VaccinationConsultationCertificatesForm({
  procedureId,
}: Readonly<{
  procedureId: string;
}>) {
  return (
    <VaccinationConsultationCertificatesTable
      procedureId={procedureId}
    ></VaccinationConsultationCertificatesTable>
  );
}
