/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export default async function SchoolEntryExaminationsPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = await props.params;

  redirect(routes.procedures.byId(procedureId).examinations.eye);
}
