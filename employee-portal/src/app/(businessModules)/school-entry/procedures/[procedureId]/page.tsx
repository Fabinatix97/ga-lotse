/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

import { SchoolEntryProcedurePageProps } from "./layout";

export default function SchoolEntryProcedurePage(
  props: SchoolEntryProcedurePageProps,
) {
  redirect(routes.procedures.byId(props.params.procedureId).details);
}
