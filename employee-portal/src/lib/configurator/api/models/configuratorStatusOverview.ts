/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@/lib/configurator/shared/routes";

import { ConfiguratorModuleName } from "./configuratorModuleName";
import { ConfiguratorStatus } from "./configuratorTabItem";

export interface ConfiguratorStatusTab {
  endpointName: TabEndpointName;
  tabButtonName: string;
  link: string;
  status?: ConfiguratorStatus; // todo: status?: ConfiguratorStatus;
}

export type ConfiguratorStatusOverview = Record<
  ConfiguratorModuleName,
  {
    moduleState: ConfiguratorStatus;
    endpointStates: ConfiguratorStatusTab[];
  }
>;

export const apiToConfiguratorStatusOverviewMapping = {
  baseModule: {
    DEPARTMENT_INFO: {
      tabButtonName: "Angaben zum Gesundheitsamt",
      link: routes.baseModule.departmentInfo,
    },
    PRIVACY_POLICY: {
      tabButtonName: "Datenschutzerklärung",
      link: "",
    },
    PRIVACY_NOTICE: {
      tabButtonName: "Datenschutzhinweise",
      link: "",
    },
  },
  schoolEntry: {
    DEPARTMENT_INFO: {
      tabButtonName: "Angaben zur Fachabteilung",
      link: routes.schoolEntry.departmentInfo,
    },
    OPENING_HOURS: {
      tabButtonName: "Öffnungszeiten",
      link: routes.schoolEntry.openingHours,
    },
    PRIVACY_POLICY: {
      tabButtonName: "Datenschutzerklärung",
      link: "",
    },
    PRIVACY_NOTICE: {
      tabButtonName: "Datenschutzhinweise",
      link: "",
    },
  },
  travelMedicine: {
    DEPARTMENT_INFO: {
      tabButtonName: "Angaben zur Fachabteilung",
      link: routes.travelMedicine.departmentInfo,
    },
    OPENING_HOURS: {
      tabButtonName: "Öffnungszeiten",
      link: routes.travelMedicine.openingHours,
    },
    NOTIFICATION: {
      tabButtonName: "Kontaktmöglichkeit per E-Mail",
      link: "",
    },
    PRIVACY_POLICY: {
      tabButtonName: "Datenschutzerklärung",
      link: "",
    },
    PRIVACY_NOTICE: {
      tabButtonName: "Datenschutzhinweise",
      link: "",
    },
  },
  measlesProtection: {
    PRIVACY_POLICY: {
      tabButtonName: "Datenschutzerklärung",
      link: "",
    },
    PRIVACY_NOTICE: {
      tabButtonName: "Datenschutzhinweise",
      link: "",
    },
  },
  medicalRegistry: {
    PRIVACY_POLICY: {
      tabButtonName: "Datenschutzerklärung",
      link: "",
    },
    PRIVACY_NOTICE: {
      tabButtonName: "Datenschutzhinweise",
      link: "",
    },
  },
  stiProtection: {
    DEPARTMENT_INFO: {
      tabButtonName: "Angaben zur Fachabteilung",
      link: routes.stiProtection.departmentInfo,
    },
    OPENING_HOURS: {
      tabButtonName: "Öffnungszeiten",
      link: routes.stiProtection.openingHours,
    },
  },
  sexWork: {
    DEPARTMENT_INFO: {
      tabButtonName: "Angaben zur Fachabteilung",
      link: routes.sexWork.departmentInfo,
    },
    OPENING_HOURS: {
      tabButtonName: "Öffnungszeiten",
      link: routes.sexWork.openingHours,
    },
  },
  officialMedicalService: {
    OPENING_HOURS: {
      tabButtonName: "Öffnungszeiten",
      link: routes.officialMedicalService.openingHours,
    },
    PRIVACY_POLICY: {
      tabButtonName: "Datenschutzerklärung",
      link: "",
    },
    PRIVACY_NOTICE: {
      tabButtonName: "Datenschutzhinweise",
      link: "",
    },
  },
  opendata: {
    OPEN_DATA: {
      tabButtonName: "",
      link: "",
    },
  },
};

export type TabEndpointName =
  keyof (typeof apiToConfiguratorStatusOverviewMapping.baseModule &
    typeof apiToConfiguratorStatusOverviewMapping.schoolEntry &
    typeof apiToConfiguratorStatusOverviewMapping.travelMedicine &
    typeof apiToConfiguratorStatusOverviewMapping.measlesProtection &
    typeof apiToConfiguratorStatusOverviewMapping.medicalRegistry &
    typeof apiToConfiguratorStatusOverviewMapping.stiProtection &
    typeof apiToConfiguratorStatusOverviewMapping.sexWork &
    typeof apiToConfiguratorStatusOverviewMapping.officialMedicalService &
    typeof apiToConfiguratorStatusOverviewMapping.opendata);
