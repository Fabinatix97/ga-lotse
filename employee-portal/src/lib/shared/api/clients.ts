/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationParameters } from "@eshg/base-api";
import {
  ConfigStatusApi,
  DepartmentInfoConfigApi,
  Configuration as LibConfigConfiguration,
  OpeningHoursApi,
} from "@eshg/lib-config-api";
import { ApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  ApiBusinessModule,
  GdprValidationTaskApi,
  Configuration as LibProceduresConfiguration,
} from "@eshg/lib-procedures-api";
import {
  Configuration as LibStatisticsConfiguration,
  StatisticsProcedureReferenceApi,
} from "@eshg/lib-statistics-api";
import {
  SexWorkConfigStatusApi,
  SexWorkDepartmentInfoConfigApi,
  SexWorkOpeningHoursApi,
  StiConsultationConfigStatusApi,
  StiConsultationDepartmentInfoConfigApi,
  StiConsultationOpeningHoursApi,
} from "@eshg/sti-protection-api";

import { useConfiguration as useStiProtectionConfiguration } from "@/lib/businessModules/stiProtection/api/clients";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

type ConfigurationConstructor<TConfiguration> = new (
  params: ConfigurationParameters,
) => TConfiguration;

const businessModuleBackendUrls = {
  [ApiBusinessModule.SchoolEntry]: "PUBLIC_SCHOOL_ENTRY_BACKEND_URL",
  [ApiBusinessModule.Inspection]: "PUBLIC_INSPECTION_BACKEND_URL",
  [ApiBusinessModule.MeaslesProtection]:
    "PUBLIC_MEASLES_PROTECTION_BACKEND_URL",
  [ApiBusinessModule.TravelMedicine]: "PUBLIC_TRAVEL_MEDICINE_BACKEND_URL",
  [ApiBusinessModule.StiProtection]: "PUBLIC_STI_PROTECTION_BACKEND_URL",
  [ApiBusinessModule.MedicalRegistry]: "PUBLIC_MEDICAL_REGISTRY_BACKEND_URL",
  [ApiBusinessModule.Dental]: "PUBLIC_DENTAL_BACKEND_URL",
  [ApiBusinessModule.OfficialMedicalService]:
    "PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL",
} as const satisfies Record<ApiBusinessModule, keyof ApiConfiguration>;

function useConfigurationByBusinessModule<TConfiguration>(
  businessModule: ApiBusinessModule,
  Configuration: ConfigurationConstructor<TConfiguration>,
): TConfiguration {
  const configurationParameters = useEmployeePortalApiConfiguration(
    businessModuleBackendUrls[businessModule],
  );

  return new Configuration(configurationParameters);
}

export function useGdprValidationTaskApi(businessModule: ApiBusinessModule) {
  const configuration = useConfigurationByBusinessModule(
    businessModule,
    LibProceduresConfiguration,
  );
  return new GdprValidationTaskApi(configuration);
}

export function useStatisticsProcedureReferenceApi(
  businessModule: ApiBusinessModule,
) {
  const configuration = useConfigurationByBusinessModule(
    businessModule,
    LibStatisticsConfiguration,
  );
  return new StatisticsProcedureReferenceApi(configuration);
}

// GA-Configurator
// note: STI_PROTECTION and SEX_WORK have different paths

// eslint-disable-next-line unused-imports/no-unused-vars
const { INSPECTION, DENTAL, ...configBusinessModuleBackendUrls } =
  businessModuleBackendUrls;
const configuratorModuleBackendUrls = {
  ...configBusinessModuleBackendUrls,
  BASE: "PUBLIC_BASE_BACKEND_URL",
  OPEN_DATA: "PUBLIC_OPENDATA_BACKEND_URL",
  SEX_WORK: "PUBLIC_STI_PROTECTION_BACKEND_URL",
} as const;

function useConfiguratorConfigurationByModule<TConfiguration>(
  configuratorModule: ConfiguratorModuleName,
  Configuration: ConfigurationConstructor<TConfiguration>,
): TConfiguration {
  const configurationParameters = useEmployeePortalApiConfiguration(
    configuratorModuleBackendUrls[configuratorModule],
  );
  return new Configuration(configurationParameters);
}

export function useConfiguratorStatusApi(
  configuratorModule: ConfiguratorModuleName,
) {
  const configuration = useConfiguratorConfigurationByModule(
    configuratorModule,
    LibConfigConfiguration,
  );
  const stiConfiguration = useStiProtectionConfiguration();

  if (configuratorModule === "STI_PROTECTION") {
    return new StiConsultationConfigStatusApi(stiConfiguration);
  } else if (configuratorModule === "SEX_WORK") {
    return new SexWorkConfigStatusApi(stiConfiguration);
  }
  return new ConfigStatusApi(configuration);
}

export function useConfiguratorDepartmentInfoApi(
  configuratorModule: ConfiguratorModuleName,
) {
  const configuration = useConfiguratorConfigurationByModule(
    configuratorModule,
    LibConfigConfiguration,
  );
  const stiConfiguration = useStiProtectionConfiguration();

  if (configuratorModule === "STI_PROTECTION") {
    return new StiConsultationDepartmentInfoConfigApi(stiConfiguration);
  } else if (configuratorModule === "SEX_WORK") {
    return new SexWorkDepartmentInfoConfigApi(stiConfiguration);
  }
  return new DepartmentInfoConfigApi(configuration);
}

export function useConfiguratorOpeningHoursApi(
  configuratorModule: ConfiguratorModuleName,
) {
  const configuration = useConfiguratorConfigurationByModule(
    configuratorModule,
    LibConfigConfiguration,
  );
  const stiConfiguration = useStiProtectionConfiguration();

  if (configuratorModule === "STI_PROTECTION") {
    return new StiConsultationOpeningHoursApi(stiConfiguration);
  } else if (configuratorModule === "SEX_WORK") {
    return new SexWorkOpeningHoursApi(stiConfiguration);
  }
  return new OpeningHoursApi(configuration);
}
