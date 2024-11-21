/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/layout";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default function StiProtectionProcedurePage({
  params,
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  redirect(routes.procedures.byId(params.id).details);
}
