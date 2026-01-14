/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { redirect } from "next/navigation";
import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { StiProtectionProcedureRouteParams } from "@/lib/businessModules/stiProtection/features/procedures/StiProtectionProcedureRouteParams";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

export default function StiProtectionProcedureExaminationPage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = use(props.params);

  redirect(routes.procedures.byId(procedureId).examination.rapidTest);
}
