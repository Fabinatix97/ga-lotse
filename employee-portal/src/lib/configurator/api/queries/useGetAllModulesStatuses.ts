/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  UseSuspenseQueryResult,
  useSuspenseQueries,
} from "@tanstack/react-query";
import assert from "assert";
import { useCallback } from "react";

import {
  ApiBusinessModule,
  ApiGetConfigurationStatusResponse,
  ApiUserRole,
} from "@eshg/base-api";
import { useHasUserRolesCheck } from "@eshg/lib-employee-portal";

import { useServerConfig } from "@/lib/baseModule/api/queries/config";
import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import {
  ConfiguratorStatusOverview,
  apiToConfiguratorStatusOverviewMapping,
} from "@/lib/configurator/api/models/configuratorStatusOverview";
import { routes } from "@/lib/configurator/shared/routes";

import { useGetModuleStatusUtils } from "./shared/useGetModuleStatusUtils";

const mapToActiveModules: Record<
  ConfiguratorModuleName,
  ApiBusinessModule | "baseModule" | "opendata"
> = {
  schoolEntry: "SCHOOL_ENTRY",
  travelMedicine: "TRAVEL_MEDICINE",
  measlesProtection: "MEASLES_PROTECTION",
  medicalRegistry: "MEDICAL_REGISTRY",
  stiProtection: "STI_PROTECTION",
  sexWork: "STI_PROTECTION",
  officialMedicalService: "OFFICIAL_MEDICAL_SERVICE",
  baseModule: "baseModule",
  opendata: "opendata",
};

export function useGetAllModulesStatuses() {
  const [hasAccess] = useHasUserRolesCheck([ApiUserRole.ConfigurationAccess]);
  const config = useServerConfig();
  const activeModules = config.data.activeModules;

  const activeConfiguratorModules = Object.keys(routes).filter((routeModule) =>
    [...activeModules, "baseModule", "opendata"].includes(
      mapToActiveModules[routeModule as ConfiguratorModuleName],
    ),
  );

  const combineResults = useCallback(
    (
      results: UseSuspenseQueryResult<
        ApiGetConfigurationStatusResponse,
        Error
      >[],
    ) => {
      const r = {
        data: hasAccess
          ? mapApiToConfiguratorStatusOverview(
              results.map((result) => result.data),
              activeConfiguratorModules,
            )
          : undefined,
      };
      return r;
    },
    [activeConfiguratorModules, hasAccess],
  );

  const { createQuery } = useGetModuleStatusUtils();

  const combinedQueries = useSuspenseQueries({
    queries: hasAccess
      ? activeConfiguratorModules.map((name) =>
          createQuery(name as ConfiguratorModuleName),
        )
      : [],
    combine: combineResults,
  });
  return combinedQueries;
}

export function mapApiToConfiguratorStatusOverview(
  data: ApiGetConfigurationStatusResponse[],
  activeConfiguratorModules: string[],
): Partial<ConfiguratorStatusOverview> {
  assert(
    data.length === activeConfiguratorModules.length,
    "Wrong number of configurator status queries",
  );

  function isIncluded(module: string) {
    return activeConfiguratorModules.includes(module);
  }

  function getModuleData(module: ConfiguratorModuleName) {
    const index = activeConfiguratorModules.findIndex(
      (activeModule) => activeModule === module,
    );
    return data[index]!;
  }

  return {
    baseModule: {
      moduleState: getModuleData("baseModule").moduleState,
      endpointStates: [
        {
          endpointName: "DEPARTMENT_INFO",
          status: getModuleData("baseModule").endpointStates.DEPARTMENT_INFO,
          ...apiToConfiguratorStatusOverviewMapping.baseModule.DEPARTMENT_INFO,
        },
        {
          endpointName: "PRIVACY_POLICY",
          status: getModuleData("baseModule").endpointStates.PRIVACY_POLICY,
          ...apiToConfiguratorStatusOverviewMapping.baseModule.PRIVACY_POLICY,
        },
        {
          endpointName: "PRIVACY_NOTICE",
          status: getModuleData("baseModule").endpointStates.PRIVACY_NOTICE,
          ...apiToConfiguratorStatusOverviewMapping.baseModule.PRIVACY_NOTICE,
        },
      ],
    },
    ...(isIncluded("schoolEntry") && {
      schoolEntry: {
        moduleState: getModuleData("schoolEntry").moduleState,
        endpointStates: [
          {
            endpointName: "DEPARTMENT_INFO",
            status:
              getModuleData("schoolEntry").endpointStates.DEPARTMENT_INFO!,
            ...apiToConfiguratorStatusOverviewMapping.schoolEntry
              .DEPARTMENT_INFO,
          },
          {
            endpointName: "OPENING_HOURS",
            status: getModuleData("schoolEntry").endpointStates.OPENING_HOURS!,
            ...apiToConfiguratorStatusOverviewMapping.schoolEntry.OPENING_HOURS,
          },
          {
            endpointName: "PRIVACY_POLICY",
            status: getModuleData("schoolEntry").endpointStates.PRIVACY_POLICY!,
            ...apiToConfiguratorStatusOverviewMapping.schoolEntry
              .PRIVACY_POLICY,
          },
          {
            endpointName: "PRIVACY_NOTICE",
            status: getModuleData("schoolEntry").endpointStates.PRIVACY_NOTICE!,
            ...apiToConfiguratorStatusOverviewMapping.schoolEntry
              .PRIVACY_NOTICE,
          },
        ],
      },
    }),
    ...(isIncluded("travelMedicine") && {
      travelMedicine: {
        moduleState: getModuleData("travelMedicine").moduleState,
        endpointStates: [
          {
            endpointName: "DEPARTMENT_INFO",
            status:
              getModuleData("travelMedicine").endpointStates.DEPARTMENT_INFO!,
            ...apiToConfiguratorStatusOverviewMapping.travelMedicine
              .DEPARTMENT_INFO,
          },
          {
            endpointName: "OPENING_HOURS",
            status:
              getModuleData("travelMedicine").endpointStates.OPENING_HOURS!,
            ...apiToConfiguratorStatusOverviewMapping.travelMedicine
              .OPENING_HOURS,
          },
          {
            endpointName: "NOTIFICATION",
            status:
              getModuleData("travelMedicine").endpointStates.NOTIFICATION!,
            ...apiToConfiguratorStatusOverviewMapping.travelMedicine
              .NOTIFICATION,
          },
          {
            endpointName: "PRIVACY_POLICY",
            status:
              getModuleData("travelMedicine").endpointStates.PRIVACY_POLICY!,
            ...apiToConfiguratorStatusOverviewMapping.travelMedicine
              .PRIVACY_POLICY,
          },
          {
            endpointName: "PRIVACY_NOTICE",
            status:
              getModuleData("travelMedicine").endpointStates.PRIVACY_NOTICE!,
            ...apiToConfiguratorStatusOverviewMapping.travelMedicine
              .PRIVACY_NOTICE,
          },
        ],
      },
    }),
    ...(isIncluded("measlesProtection") && {
      measlesProtection: {
        moduleState: getModuleData("measlesProtection").moduleState,
        endpointStates: [
          {
            endpointName: "PRIVACY_POLICY",
            status:
              getModuleData("measlesProtection").endpointStates.PRIVACY_POLICY!,
            ...apiToConfiguratorStatusOverviewMapping.measlesProtection
              .PRIVACY_POLICY,
          },
          {
            endpointName: "PRIVACY_NOTICE",
            status:
              getModuleData("measlesProtection").endpointStates.PRIVACY_NOTICE!,
            ...apiToConfiguratorStatusOverviewMapping.measlesProtection
              .PRIVACY_NOTICE,
          },
        ],
      },
    }),
    ...(isIncluded("medicalRegistry") && {
      medicalRegistry: {
        moduleState: getModuleData("medicalRegistry").moduleState,
        endpointStates: [
          {
            endpointName: "PRIVACY_POLICY",
            status:
              getModuleData("medicalRegistry").endpointStates.PRIVACY_POLICY!,
            ...apiToConfiguratorStatusOverviewMapping.medicalRegistry
              .PRIVACY_POLICY,
          },
          {
            endpointName: "PRIVACY_NOTICE",
            status:
              getModuleData("medicalRegistry").endpointStates.PRIVACY_NOTICE!,
            ...apiToConfiguratorStatusOverviewMapping.medicalRegistry
              .PRIVACY_NOTICE,
          },
        ],
      },
    }),
    ...(isIncluded("stiProtection") && {
      stiProtection: {
        moduleState: getModuleData("stiProtection").moduleState,
        endpointStates: [
          {
            endpointName: "DEPARTMENT_INFO",
            status:
              getModuleData("stiProtection").endpointStates.DEPARTMENT_INFO!,
            ...apiToConfiguratorStatusOverviewMapping.stiProtection
              .DEPARTMENT_INFO,
          },
          {
            endpointName: "OPENING_HOURS",
            status:
              getModuleData("stiProtection").endpointStates.OPENING_HOURS!,
            ...apiToConfiguratorStatusOverviewMapping.stiProtection
              .OPENING_HOURS,
          },
        ],
      },
    }),
    ...(isIncluded("sexWork") && {
      sexWork: {
        moduleState: getModuleData("sexWork").moduleState,
        endpointStates: [
          {
            endpointName: "DEPARTMENT_INFO",
            status: getModuleData("sexWork").endpointStates.DEPARTMENT_INFO!,
            ...apiToConfiguratorStatusOverviewMapping.stiProtection
              .DEPARTMENT_INFO,
          },
          {
            endpointName: "OPENING_HOURS",
            status: getModuleData("sexWork").endpointStates.OPENING_HOURS!,
            ...apiToConfiguratorStatusOverviewMapping.stiProtection
              .OPENING_HOURS,
          },
        ],
      },
    }),
    ...(isIncluded("officialMedicalService") && {
      officialMedicalService: {
        moduleState: getModuleData("officialMedicalService").moduleState,
        endpointStates: [
          {
            endpointName: "OPENING_HOURS",
            status: getModuleData("officialMedicalService").endpointStates
              .OPENING_HOURS!,
            ...apiToConfiguratorStatusOverviewMapping.officialMedicalService
              .OPENING_HOURS,
          },
          {
            endpointName: "PRIVACY_POLICY",
            status: getModuleData("officialMedicalService").endpointStates
              .PRIVACY_POLICY!,
            ...apiToConfiguratorStatusOverviewMapping.officialMedicalService
              .PRIVACY_POLICY,
          },
          {
            endpointName: "PRIVACY_NOTICE",
            status: getModuleData("officialMedicalService").endpointStates
              .PRIVACY_NOTICE!,
            ...apiToConfiguratorStatusOverviewMapping.officialMedicalService
              .PRIVACY_NOTICE,
          },
        ],
      },
    }),
    opendata: {
      moduleState: getModuleData("opendata").moduleState,
      endpointStates: [
        {
          endpointName: "OPEN_DATA",
          status: getModuleData("opendata").endpointStates.OPEN_DATA!,
          ...apiToConfiguratorStatusOverviewMapping.opendata.OPEN_DATA,
        },
      ],
    },
  };
}
