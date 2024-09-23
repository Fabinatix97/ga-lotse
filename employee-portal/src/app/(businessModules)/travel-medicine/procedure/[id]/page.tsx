/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { routes as businessRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function VaccinationConsultationPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  // if no tab name is given in the URL redirect to the "basedata" tab page
  redirect(businessRoutes.procedures.baseData(params.id));
}
