/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { DynamicPageProps } from "@eshg/lib-portal";

import { StiProtectionProcedureRouteParams } from "@/lib/businessModules/stiProtection/features/procedures/StiProtectionProcedureRouteParams";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default async function StiProtectionProcedurePage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id } = await props.params;

  redirect(routes.procedures.byId(id).details);
}
