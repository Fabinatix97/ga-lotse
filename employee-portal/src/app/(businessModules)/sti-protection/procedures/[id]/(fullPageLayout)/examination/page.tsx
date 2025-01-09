/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { redirect } from "next/navigation";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default function StiProtectionProcedureExaminationPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  redirect(routes.procedures.byId(procedureId).rapidTest);
}
