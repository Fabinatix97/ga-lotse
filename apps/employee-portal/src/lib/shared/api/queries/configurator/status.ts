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
import { MEASLES_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/MeaslesProtectionAppointmentStandardDuration";
import { OMS_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/OmsAppointmentStandardDuration";
import { PROSTITUTE_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/ProstituteProtectionAppointmentStandardDuration";
import { SCHOOL_ENTRY_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/SchoolEntryAppointmentStandardDuration";
import { SEX_WORK_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/SexWorkAppointmentStandardDuration";
import { STI_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/StiProtectionAppointmentStandardDuration";
import { TRAVEL_MEDICINE_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/TravelMedicineAppointmentStandardDuration";
import { getTabNamesByEndpointName } from "@/lib/configurator/components/shared/configuratorNameMapping";
import { getEndpointNamesByModule } from "@/lib/configurator/shared/config";
import { resolveConfiguratorRoute } from "@/lib/configurator/shared/routes";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorStatusApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

const configuratorModules = Object.freeze(
  Object.values(ConfiguratorModuleName),
);

function combineResults(
  results: UseSuspenseQueryResult<
    Record<
      string,
      ApiGetConfigurationStatusResponse | ConfigurationStatusUnavailableResponse
    >,
    Error
  >[],
) {
  return {
    data: mapApiToConfiguratorStatusOverview(
      (results ?? []).map((result) => result.data).filter(isDefined),
    ),
  };
}

export function useGetAllModulesStatuses() {
  const { data: config } = useGetPublicConfig();
  const activeModules = [
    ...config.activeModules,
    "BASE",
    config.isOpenDataEnabled ? "OPEN_DATA" : undefined,
    config.activeModules.includes("STI_PROTECTION") ? "SEX_WORK" : undefined,
  ];

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
        status: result.endpointStates
          ? result.endpointStates[endpointName]
          : ("UNAVAILABLE" as const),
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
        return (configuratorApi as SexWorkConfigStatusApi)
          .getConfiguration1()
          .catch(unavailableModule);
      }
      return (configuratorApi as ConfigStatusApi)
        .getConfiguration()
        .catch(unavailableModule);
    },
    select: (
      data:
        | ApiGetConfigurationStatusResponse
        | ConfigurationStatusUnavailableResponse,
    ) => ({
      [module]: data,
    }),
  });
}

export interface ConfigurationStatusUnavailableResponse {
  endpointStates: undefined;
  moduleState: "UNAVAILABLE";
}

function unavailableModule(): ConfigurationStatusUnavailableResponse {
  return { endpointStates: undefined, moduleState: "UNAVAILABLE" };
}

function mapApiToConfiguratorStatusOverview(
  data: Record<
    string,
    ApiGetConfigurationStatusResponse | ConfigurationStatusUnavailableResponse
  >[],
): ConfiguratorStatusOverview {
  return data.reduce((prev, curr) => {
    const moduleName = Object.keys(curr)[0]! as ConfiguratorModuleName;
    const value = curr[moduleName]!;
    const endpointStates = value?.endpointStates;
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
              status: endpointStates
                ? endpointStates[
                    configuredEndpoint === "APPOINTMENT_STANDARD_DURATION"
                      ? mapStandardAppointmentDurationEndpoint(moduleName)
                      : configuredEndpoint
                  ]
                : "UNAVAILABLE",
            }) satisfies ConfiguratorStatusTab,
        ),
      },
    };
  }, {} as ConfiguratorStatusOverview);
}

function mapStandardAppointmentDurationEndpoint(
  moduleName: ConfiguratorModuleName,
) {
  switch (moduleName) {
    case ConfiguratorModuleName.SchoolEntry:
      return SCHOOL_ENTRY_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME;
    case ConfiguratorModuleName.TravelMedicine:
      return TRAVEL_MEDICINE_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME;
    case ConfiguratorModuleName.MeaslesProtection:
      return MEASLES_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME;
    case ConfiguratorModuleName.OfficialMedicalService:
      return OMS_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME;
    case ConfiguratorModuleName.StiProtection:
      return STI_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME;
    case ConfiguratorModuleName.sexWork:
      return SEX_WORK_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME;
    case ConfiguratorModuleName.ProstituteProtection:
      return PROSTITUTE_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME;
    default:
      return "APPOINTMENT_STANDARD_DURATION";
  }
}
