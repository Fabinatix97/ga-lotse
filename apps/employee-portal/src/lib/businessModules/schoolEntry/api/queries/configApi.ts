/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";
import {
  ApiGetSchoolEntryConfigResponse,
  SchoolEntryConfigApi,
} from "@eshg/school-entry-api";

import { useConfigApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { configApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function useGetLocationSelectionMode() {
  const configApi = useConfigApi();
  const { data: locationSelectionMode } = useSuspenseQuery(
    getLocationSelectionModeQuery(configApi),
  );
  return locationSelectionMode;
}

export function useIsDirectProcedureTypeAssignmentOnImport() {
  const configApi = useConfigApi();
  const { data: isDirectProcedureTypeAssignmentOnImport } = useSuspenseQuery(
    getIsDirectProcedureTypeAssignmentOnImportQuery(configApi),
  );
  return isDirectProcedureTypeAssignmentOnImport;
}

function getIsDirectProcedureTypeAssignmentOnImportQuery(
  configApi: SchoolEntryConfigApi,
) {
  return getConfigValueQuery(
    configApi,
    (response) => response.isDirectProcedureTypeAssignmentOnImport,
  );
}

export function getLocationSelectionModeQuery(configApi: SchoolEntryConfigApi) {
  return getConfigValueQuery(
    configApi,
    (response) => response.locationSelectionMode,
  );
}

function getConfigValueQuery<TValue>(
  configApi: SchoolEntryConfigApi,
  select: (response: ApiGetSchoolEntryConfigResponse) => TValue,
) {
  return queryOptions({
    ...STATIC_QUERY_OPTIONS,
    queryKey: configApiQueryKey(["getConfig"]),
    queryFn: () => configApi.getConfig(),
    select,
  });
}
