/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { SchoolEntryProcedurePageProps } from "@/app/(businessModules)/school-entry/procedures/[procedureId]/layout";
import {
  useConfigApi,
  useSchoolEntryApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { getProcedureQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/ProcedureDetails";

export default function SchoolEntryProcedureDetailsPage(
  props: SchoolEntryProcedurePageProps,
) {
  const schoolEntryApi = useSchoolEntryApi();
  const configApi = useConfigApi();
  const [{ data: procedure }, { data: locationSelectionMode }] =
    useSuspenseQueries({
      queries: [
        getProcedureQuery(schoolEntryApi, props.params.procedureId),
        getLocationSelectionModeQuery(configApi),
      ],
    });

  return (
    <ProcedureDetails
      procedure={procedure}
      locationSelectionMode={locationSelectionMode}
    />
  );
}
