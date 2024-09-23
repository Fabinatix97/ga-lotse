/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetVaccinationConsultationCertificates } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { VaccinationConsultationCertificatesTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/VaccinationConsultationCertificatesTable";

export function VaccinationConsultationCertificatesForm({
  procedureId,
}: Readonly<{
  procedureId: string;
}>) {
  const callResult = useGetVaccinationConsultationCertificates(procedureId);
  const tableData = callResult.data?.certificates ?? [];

  return (
    <VaccinationConsultationCertificatesTable
      procedureId={procedureId}
      tableData={tableData}
    ></VaccinationConsultationCertificatesTable>
  );
}
