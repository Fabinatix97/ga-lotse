/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { DocumentsTable } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentsTable";

export default function OfficialMedicalServiceProcedureDetailsPage(
  props: DynamicPageProps<OfficialMedicalServiceDetailsRouteParamsSchema>,
) {
  const { id } = props.params;

  return <DocumentsTable procedureId={id} />;
}
