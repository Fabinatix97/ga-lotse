/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { StiProtectionProcedureRouteParams } from "@/lib/businessModules/stiProtection/features/procedures/StiProtectionProcedureRouteParams";
import { ProcedureDetails } from "@/lib/businessModules/stiProtection/features/procedures/details/ProcedureDetails";

export default function StiProtectionProcedureDetailsPage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = use(props.params);
  const procedure = useStiProcedureQuery(procedureId).data;

  return <ProcedureDetails procedure={procedure} />;
}
