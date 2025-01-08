/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";

export interface MedicalRegistryProcedurePageParams {
  id: string;
}

export default function MedicalRegistryProcedurePage({
  params,
}: Readonly<{
  params: MedicalRegistryProcedurePageParams;
}>) {
  redirect(routes.procedures.byId(params.id).details);
}
