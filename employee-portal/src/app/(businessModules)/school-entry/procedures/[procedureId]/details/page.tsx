/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import {
  useConfigApi,
  useSchoolEntryApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { getProcedureQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/ProcedureDetails";

export default function SchoolEntryProcedureDetailsPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = use(props.params);
  const schoolEntryApi = useSchoolEntryApi();
  const configApi = useConfigApi();
  const [{ data: procedure }, { data: locationSelectionMode }] =
    useSuspenseQueries({
      queries: [
        getProcedureQuery(schoolEntryApi, procedureId),
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
