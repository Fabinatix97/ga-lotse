/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { SchoolEntryProcedurePageProps } from "@/app/(businessModules)/school-entry/procedures/[procedureId]/layout";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export default function SchoolEntryExaminationsPage(
  props: SchoolEntryProcedurePageProps,
) {
  redirect(routes.procedures.byId(props.params.procedureId).examinations.eye);
}
