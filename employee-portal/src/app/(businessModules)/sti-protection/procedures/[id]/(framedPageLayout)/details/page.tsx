/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { StiProtectionProcedureRouteParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(framedPageLayout)/layout";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { ProcedureDetails } from "@/lib/businessModules/stiProtection/features/procedures/details/ProcedureDetails";

export default function StiProtectionProcedureDetailsPage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = props.params;
  const procedure = useStiProcedureQuery(procedureId).data;

  return <ProcedureDetails procedure={procedure} />;
}
