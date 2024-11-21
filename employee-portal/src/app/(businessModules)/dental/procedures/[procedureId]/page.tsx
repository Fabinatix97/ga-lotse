/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { DentalProcedurePageProps } from "@/app/(businessModules)/dental/procedures/[procedureId]/layout";
import { routes } from "@/lib/businessModules/dental/shared/routes";

export default function DentalProcedureIndexPage(
  props: DentalProcedurePageProps,
) {
  redirect(routes.procedures.byId(props.params.procedureId).details);
}
