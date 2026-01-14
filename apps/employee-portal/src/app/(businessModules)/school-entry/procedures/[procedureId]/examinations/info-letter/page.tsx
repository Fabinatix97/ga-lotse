/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/features/procedures/reports/schoolInfoLetter/SchoolInfoLetter";

export default function SchoolInfoLetterPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = use(props.params);

  return <SchoolInfoLetter procedureId={procedureId} />;
}
