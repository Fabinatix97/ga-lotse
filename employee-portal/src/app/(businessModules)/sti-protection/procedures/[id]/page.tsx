/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { StiProtectionProcedureRouteParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(framedPageLayout)/layout";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default async function StiProtectionProcedurePage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id } = await props.params;

  redirect(routes.procedures.byId(id).details);
}
