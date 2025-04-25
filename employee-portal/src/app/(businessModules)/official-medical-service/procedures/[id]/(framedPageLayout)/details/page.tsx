/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { ProcedureDetailsTab } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/ProcedureDetailsTab";

export default function OfficialMedicalServiceProcedureDetailsPage(
  props: DynamicPageProps<OfficialMedicalServiceDetailsRouteParamsSchema>,
) {
  const { id } = use(props.params);

  return <ProcedureDetailsTab procedureId={id} />;
}
