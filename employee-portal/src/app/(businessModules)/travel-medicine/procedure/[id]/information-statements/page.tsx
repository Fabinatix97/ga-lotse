/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InformationStatementsTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/informationStatements/InformationStatementsTable";

export default function InformationStatementsPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return <InformationStatementsTable procedureId={params.id} />;
}
