/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { redirect } from "next/navigation";

import { routes as businessRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function VaccinationConsultationPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

  // if no tab name is given in the URL redirect to the "basedata" tab page
  redirect(businessRoutes.procedures.baseData(id));
}
