/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { redirect } from "next/navigation";

import { StiProtectionProcedureRouteParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default function StiProtectionProcedureExaminationPage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = props.params;

  redirect(routes.procedures.byId(procedureId).examination.rapidTest);
}
