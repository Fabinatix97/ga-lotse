/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Configuration as BaseConfiguration,
  BasePrivacyDocumentsApi,
  ConfigurationParameters,
  DepartmentConfigurationApi,
} from "@eshg/base-api";
import {
  ConfigStatusApi,
  DepartmentInfoConfigApi,
  Configuration as LibConfigConfiguration,
  OpeningHoursApi,
  PrivacyDocumentApi,
} from "@eshg/lib-config-api";
import { ApiConfiguration } from "@eshg/lib-portal";
import {
  ApiBusinessModule,
  GdprValidationTaskApi,
  Configuration as LibProceduresConfiguration,
} from "@eshg/lib-procedures-api";
import {
  Configuration as LibStatisticsConfiguration,
  StatisticsProcedureReferenceApi,
} from "@eshg/lib-statistics-api";
import { MeaslesProtectionAppointmentStandardDurationApi } from "@eshg/measles-protection-api";
import { OmsAppointmentStandardDurationApi } from "@eshg/official-medical-service-api";
import { OpenDataConfigApi } from "@eshg/opendata-api";
import {
  SchoolEntryAppointmentStandardDurationApi,
  SchoolEntryLibConfigApi,
} from "@eshg/school-entry-api";
import {
  SexWorkConfigStatusApi,
  SexWorkDepartmentInfoConfigApi,
  SexWorkOpeningHoursApi,
  StiConsultationConfigStatusApi,
  StiConsultationDepartmentInfoConfigApi,
  StiConsultationOpeningHoursApi,
  StiProtectionAppointmentStandardDurationApi,
} from "@eshg/sti-protection-api";
import {
  NotificationConfigApi,
  TravelMedicineAppointmentStandardDurationApi,
} from "@eshg/travel-medicine-api";

import { useConfiguration } from "@/lib/baseModule/api/clients";
import { useConfiguration as useMeaslesProtectionConfiguration } from "@/lib/businessModules/measlesProtection/api/clients";
import { useConfiguration as useOmsConfiguration } from "@/lib/businessModules/officialMedicalService/api/clients";
import { useConfiguration as useSchoolEntryConfiguration } from "@/lib/businessModules/schoolEntry/api/clients";
import { useConfiguration as useStiProtectionConfiguration } from "@/lib/businessModules/stiProtection/api/clients";
import { useConfiguration as useTravelMedicineConfiguration } from "@/lib/businessModules/travelMedicine/api/clients";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguration as useOpenDataConfiguration } from "@/lib/opendata/api/clients";
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
  [ApiBusinessModule.MedsAbroad]: "PUBLIC_MEDS_ABROAD_BACKEND_URL",
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

export function useConfiguratorSchoolEntryApi() {
  const configuration = useSchoolEntryConfiguration();
  return new SchoolEntryLibConfigApi(configuration);
}

export function useNotificationConfigApi() {
  const configuration = useTravelMedicineConfiguration();
  return new NotificationConfigApi(configuration);
}

export function useConfiguratorPrivacyDocumentApi(
  configuratorModule: ConfiguratorModuleName,
) {
  const moduleConfiguration = useConfiguratorConfigurationByModule(
    configuratorModule,
    LibConfigConfiguration,
  );
  const baseConfiguration = useConfiguratorConfigurationByModule(
    "BASE",
    BaseConfiguration,
  );
  return {
    moduleApi: new PrivacyDocumentApi(moduleConfiguration),
    baseApi: new BasePrivacyDocumentsApi(baseConfiguration),
  };
}

export function useDepartmentConfigurationApi() {
  const configuration = useConfiguration();

  return new DepartmentConfigurationApi(configuration);
}

export function useSchoolEntryAppointmentStandardDurationApi() {
  const configuration = useSchoolEntryConfiguration();
  return new SchoolEntryAppointmentStandardDurationApi(configuration);
}

export function useTravelMedicineAppointmentStandardDurationApi() {
  const configuration = useTravelMedicineConfiguration();
  return new TravelMedicineAppointmentStandardDurationApi(configuration);
}

export function useMeaslesProtectionAppointmentStandardDurationApi() {
  const configuration = useMeaslesProtectionConfiguration();
  return new MeaslesProtectionAppointmentStandardDurationApi(configuration);
}

export function useOmsAppointmentStandardDurationApi() {
  const configuration = useOmsConfiguration();
  return new OmsAppointmentStandardDurationApi(configuration);
}

export function useStiProtectionAppointmentStandardDurationApi() {
  const configuration = useStiProtectionConfiguration();
  return new StiProtectionAppointmentStandardDurationApi(configuration);
}

export function useOpenDataConfigApi() {
  const configuration = useOpenDataConfiguration();
  return new OpenDataConfigApi(configuration);
}
