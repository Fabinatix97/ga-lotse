/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UseSuspenseQueryResult,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { isDefined } from "remeda";

import { ApiGetConfigurationStatusResponse } from "@eshg/base-api";
import { ConfigStatusApi } from "@eshg/lib-config-api";
import { useGetPublicConfig } from "@eshg/lib-employee-portal";
import {
  SexWorkConfigStatusApi,
  StiConsultationConfigStatusApi,
} from "@eshg/sti-protection-api";

import {
  ConfiguratorStatusOverview,
  ConfiguratorStatusTab,
} from "@/lib/configurator/api/models/configuratorStatusOverview";
import { getTabNamesByEndpointName } from "@/lib/configurator/components/shared/configuratorNameMapping";
import { getEndpointNamesByModule } from "@/lib/configurator/shared/config";
import { resolveConfiguratorRoute } from "@/lib/configurator/shared/routes";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorStatusApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

const configuratorModules = Object.freeze(
  Object.values(ConfiguratorModuleName),
);

export function useGetAllModulesStatuses() {
  const { data: config } = useGetPublicConfig();
  const activeModules = [
    ...config.activeModules,
    "BASE",
    "OPEN_DATA",
    config.activeModules.includes("STI_PROTECTION") ? "SEX_WORK" : undefined,
  ];

  const combineResults = useCallback(
    (
      results: UseSuspenseQueryResult<
        Record<string, ApiGetConfigurationStatusResponse>,
        Error
      >[],
    ) => {
      const r = {
        data: mapApiToConfiguratorStatusOverview(
          results.map((result) => result.data).filter(isDefined),
        ),
      };
      return r;
    },
    [],
  );

  const queries = configuratorModules
    .filter((module) => activeModules.includes(module))
    .map((module) => {
      // Using hooks in a loop is allowed here, since the businessModules array is constant.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const configuratorStatusApi = useConfiguratorStatusApi(module);
      return getStatusQuery(configuratorStatusApi, module);
    });

  return useSuspenseQueries({
    queries,
    combine: combineResults,
  });
}

export function useGetSingleModuleStatus(
  module: ConfiguratorModuleName,
  endpointName: string,
) {
  const configuratorStatusApi = useConfiguratorStatusApi(module);
  return useSuspenseQuery({
    ...getStatusQuery(configuratorStatusApi, module),
    select: (result) => {
      return {
        endpointName,
        status: result.endpointStates[endpointName],
      };
    },
  });
}

function getStatusQuery(
  configuratorApi:
    | ConfigStatusApi
    | StiConsultationConfigStatusApi
    | SexWorkConfigStatusApi,
  module: ConfiguratorModuleName,
) {
  return queryOptions({
    queryKey: configuratorApiQueryKey([
      module,
      configuratorApi,
      "getConfiguration",
    ]),
    queryFn: () => {
      if (module === "SEX_WORK") {
        return (configuratorApi as SexWorkConfigStatusApi).getConfiguration1();
      }
      return (configuratorApi as ConfigStatusApi).getConfiguration();
    },
    select: (data: ApiGetConfigurationStatusResponse) => ({
      [module]: data,
    }),
  });
}

function mapApiToConfiguratorStatusOverview(
  data: Record<string, ApiGetConfigurationStatusResponse>[],
): ConfiguratorStatusOverview {
  return data.reduce((prev, curr) => {
    const moduleName = Object.keys(curr)[0]! as ConfiguratorModuleName;
    const value = curr[moduleName]!;
    const endpointStates = value.endpointStates;
    return {
      ...prev,
      [moduleName]: {
        moduleState: value.moduleState,
        endpointStates: getEndpointNamesByModule(moduleName).map(
          (configuredEndpoint) =>
            ({
              endpointName: configuredEndpoint,
              tabButtonName: getTabNamesByEndpointName(
                moduleName,
                configuredEndpoint,
              ),
              link: resolveConfiguratorRoute({
                module: moduleName,
                endpointName: configuredEndpoint,
              }),
              status: endpointStates[configuredEndpoint],
            }) satisfies ConfiguratorStatusTab,
        ),
      },
    };
  }, {} as ConfiguratorStatusOverview);
}
