/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { InformationStatementsTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/informationStatements/InformationStatementsTable";

export default function InformationStatementsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);

  return <InformationStatementsTable procedureId={id} />;
}
