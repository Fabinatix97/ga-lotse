/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/layout";
import { ProcedureDetails } from "@/lib/businessModules/stiProtection/features/procedures/details/ProcedureDetails";

export default function StiProtectionProcedureDetailsPage({
  params,
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  return <ProcedureDetails procedureId={params.id} />;
}
