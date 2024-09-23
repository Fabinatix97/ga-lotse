/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SchoolEntryProcedurePageProps } from "@/app/(businessModules)/school-entry/procedures/[id]/layout";
import { useGetProcedure } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/ProcedureDetails";

export default function SchoolEntryProcedureDetailsPage(
  props: SchoolEntryProcedurePageProps,
) {
  const procedureQuery = useGetProcedure(props.params.id);

  return <ProcedureDetails procedure={procedureQuery.data} />;
}
