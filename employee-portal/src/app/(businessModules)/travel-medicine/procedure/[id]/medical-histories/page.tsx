/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MedicalHistoriesContent } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistoryContent";

export default function MedicalHistories({
  params,
}: Readonly<{ params: { id: string } }>) {
  return (
    <MedicalHistoriesContent procedureId={params.id}></MedicalHistoriesContent>
  );
}
