/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  UseSuspenseQueryResult,
  useSuspenseQueries,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { doNothing } from "remeda";

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { ConfiguratorStatusOverview } from "@/lib/configurator/api/models/configuratorStatusOverview";
import { routes } from "@/lib/configurator/shared/routes";

export function useGetModuleStatus(module?: ConfiguratorModuleName) {
  // todo: put all status requests in this file
  const tabItems: ConfiguratorStatusOverview = {
    baseModule: {
      overview: "error",
      tabs: [
        {
          tabButtonName: "Angaben zum Gesundheitsamt",
          link: routes.baseModule.departmentInfo,
          status: "error",
        },
        {
          tabButtonName: "Logo (Website-Header)",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Verzeichnisse",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Datenschutzerklärung",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Datenschutzhinweise",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Impressum",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Barrierefreiheit",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Danksagungen",
          link: "",
          status: "complete",
        },
      ],
    },
    schoolEntry: {
      overview: "warning",
      tabs: [
        {
          tabButtonName: "Angaben zur Fachabteilung",
          link: routes.schoolEntry.departmentInfo,
          status: "complete",
        },
        {
          tabButtonName: "Öffnungszeiten",
          link: routes.schoolEntry.openingHours,
          status: "warning",
        },
        {
          tabButtonName: "Fachliche Einstellungen",
          link: "",
          status: "complete",
        },
      ],
    },
    travelMedicine: {
      overview: "complete",
      tabs: [
        {
          tabButtonName: "Angaben zur Fachabteilung",
          link: routes.travelMedicine.departmentInfo,
          status: "complete",
        },
        {
          tabButtonName: "Öffnungszeiten",
          link: routes.travelMedicine.openingHours,
          status: "complete",
        },
        {
          tabButtonName: "Standard-Termindauer",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Kontaktmöglichkeit per E-Mail",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Datenschutzerklärung",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Datenschutzhinweise",
          link: "",
          status: "complete",
        },
      ],
    },
    measlesProtection: {
      overview: "complete",
      tabs: [
        {
          tabButtonName: "Angaben zur Fachabteilung",
          link: routes.measlesProtection.departmentInfo, // need clarify
          status: "complete",
        },
        {
          tabButtonName: "Öffnungszeiten",
          link: routes.measlesProtection.openingHours,
          status: "complete",
        },
        {
          tabButtonName: "Standard-Termindauer",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Datenschutzerklärung",
          link: "",
          status: "complete",
        },
        {
          tabButtonName: "Datenschutzhinweise",
          link: "",
          status: "complete",
        },
      ],
    },
    medicalRegistry: {
      overview: "complete",
      tabs: [
        {
          tabButtonName: "Datenschutzerklärung",
          link: routes.medicalRegistry.departmentInfo, // need clarify
          status: "complete",
        },
        {
          tabButtonName: "Datenschutzhinweise",
          link: "",
          status: "complete",
        },
      ],
    },
    stiProtection: {
      overview: "complete",
      tabs: [
        {
          tabButtonName: "Angaben zur Fachabteilung",
          link: routes.stiProtection.departmentInfo,
          status: "complete",
        },
        {
          tabButtonName: "Öffnungszeiten",
          link: routes.stiProtection.openingHours,
          status: "complete",
        },
        {
          tabButtonName: "Standard-Termindauer",
          link: "",
          status: "complete",
        },
      ],
    },
    sexWork: {
      overview: "complete",
      tabs: [
        {
          tabButtonName: "Angaben zur Fachabteilung",
          link: routes.sexWork.departmentInfo,
          status: "complete",
        },
        {
          tabButtonName: "Öffnungszeiten",
          link: routes.sexWork.openingHours,
          status: "complete",
        },
        {
          tabButtonName: "Standard-Termindauer",
          link: "",
          status: "complete",
        },
      ],
    },
    officialMedicalService: {
      overview: "error",
      tabs: [
        {
          tabButtonName: "Öffnungszeiten",
          link: routes.officialMedicalService.openingHours,
          status: "complete",
        },
      ],
    },
  };

  const combineResults = useCallback(
    (results: UseSuspenseQueryResult<ConfiguratorStatusOverview, Error>[]) => {
      return {
        data: module
          ? results[0]!.data
          : results
              .map((result) => result.data)
              .reduce(
                (pre, data) => ({
                  ...pre,
                  ...data,
                }),
                {} as ConfiguratorStatusOverview,
              ),
      };
    },
    [module],
  );

  const combinedQueries = useSuspenseQueries({
    queries: module
      ? [{ queryKey: [module], queryFn: doNothing }]
      : Object.keys(routes).map((name) => ({
          queryKey: [name],
          queryFn: doNothing,
          select: () =>
            ({
              [name]: tabItems[name as ConfiguratorModuleName],
            }) as ConfiguratorStatusOverview,
        })),
    combine: combineResults,
  });
  return combinedQueries;
}
