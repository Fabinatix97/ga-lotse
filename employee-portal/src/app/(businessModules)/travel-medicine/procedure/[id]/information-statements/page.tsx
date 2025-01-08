/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTravelMedicineFeature } from "@eshg/employee-portal-api/travelMedicine";

import { InformationStatementsTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/informationStatements/InformationStatementsTable";
import { ToggledPage } from "@/lib/businessModules/travelMedicine/shared/ToggledPage";

export default function InformationStatementsPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return (
    <ToggledPage
      feature={ApiTravelMedicineFeature.CitizenPortalInformationStatement}
    >
      <InformationStatementsTable procedureId={params.id} />
    </ToggledPage>
  );
}
