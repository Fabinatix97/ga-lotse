/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { redirect } from "next/navigation";

import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

export default async function OfficialMedicalServiceProcedureIndexPage(
  props: DynamicPageProps<OfficialMedicalServiceDetailsRouteParamsSchema>,
) {
  const { id } = await props.params;

  redirect(routes.procedures.byId(id).details);
}
