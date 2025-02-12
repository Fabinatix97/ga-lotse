/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { OfficialMedicalServiceDetailsPageProps } from "@/app/(businessModules)/official-medical-service/procedures/[id]/layout";
import { DocumentsTable } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentsTable";

export default function OfficialMedicalServiceProcedureDetailsPage(
  props: OfficialMedicalServiceDetailsPageProps,
) {
  return <DocumentsTable procedureId={props.params.id} />;
}
