/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { redirect } from "next/navigation";

import { StiProtectionProcedureRouteParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(framedPageLayout)/layout";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default function StiProtectionProcedurePage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id } = props.params;

  redirect(routes.procedures.byId(id).details);
}
