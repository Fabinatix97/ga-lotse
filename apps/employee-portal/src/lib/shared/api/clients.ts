/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AddressDirectoryConfigApi,
  Configuration as BaseConfiguration,
  BasePrivacyDocumentsApi,
  ConfigurationParameters,
  DepartmentConfigurationApi,
} from "@eshg/base-api";
import {
  InfectionBriefingAppointmentStandardDurationConfigApi,
  InfectionBriefingConfigApi,
  Configuration as InfectionBriefingConfiguration,
} from "@eshg/infection-briefing-api";
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
import { MeaslesProtectionAppointmentStandardDurationConfigApi } from "@eshg/measles-protection-api";
import {
  OmsAppointmentStandardDurationConfigApi,
  OmsConfigApi,
} from "@eshg/official-medical-service-api";
import { OpenDataConfigApi } from "@eshg/opendata-api";
import {
  AppointmentBlockAvailabilityConfigApi as ProstituteProtectionAppointmentBlockAvailabilityConfigApi,
  ProstituteProtectionAppointmentStandardDurationConfigApi,
  ProstituteProtectionConfigApi,
  Configuration as ProstituteProtectionConfiguration,
} from "@eshg/prostitute-protection-api";
import {
  AppointmentBlockAvailabilityConfigApi as SchoolEntryAppointmentBlockAvailabilityConfigApi,
  SchoolEntryAppointmentStandardDurationConfigApi,
  SchoolEntryDeviceRegistryConfigApi,
  SchoolEntryLibConfigApi,
} from "@eshg/school-entry-api";
import {
  SexWorkConfigStatusApi,
  SexWorkDepartmentInfoConfigApi,
  SexWorkOpeningHoursApi,
  StiConsultationConfigStatusApi,
  StiConsultationDepartmentInfoConfigApi,
  StiConsultationOpeningHoursApi,
  StiProtectionAppointmentStandardDurationConfigApi,
} from "@eshg/sti-protection-api";
import {
  NotificationConfigApi,
  TravelMedicineAppointmentStandardDurationConfigApi,
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
  [ApiBusinessModule.ProstituteProtection]:
    "PUBLIC_PROSTITUTE_PROTECTION_BACKEND_URL",
  [ApiBusinessModule.InfectionBriefing]:
    "PUBLIC_INFECTION_BRIEFING_BACKEND_URL",
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
const { DENTAL, ...configBusinessModuleBackendUrls } =
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

export function useSchoolEntryDeviceRegistryConfigApi() {
  const configuration = useSchoolEntryConfiguration();
  return new SchoolEntryDeviceRegistryConfigApi(configuration);
}

export function useConfiguratorOmsApi() {
  const configuration = useOmsConfiguration();
  return new OmsConfigApi(configuration);
}

export function useConfiguratorProstituteProtectionApi() {
  const configuration = useConfigurationByBusinessModule(
    ApiBusinessModule.ProstituteProtection,
    ProstituteProtectionConfiguration,
  );
  return new ProstituteProtectionConfigApi(configuration);
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

export function useSchoolEntryAppointmentStandardDurationConfigApi() {
  const configuration = useSchoolEntryConfiguration();
  return new SchoolEntryAppointmentStandardDurationConfigApi(configuration);
}

export function useSchoolEntryAppointmentBlockAvailabilityApi() {
  const configuration = useSchoolEntryConfiguration();
  return new SchoolEntryAppointmentBlockAvailabilityConfigApi(configuration);
}

export function useTravelMedicineAppointmentStandardDurationConfigApi() {
  const configuration = useTravelMedicineConfiguration();
  return new TravelMedicineAppointmentStandardDurationConfigApi(configuration);
}

export function useMeaslesProtectionAppointmentStandardDurationConfigApi() {
  const configuration = useMeaslesProtectionConfiguration();
  return new MeaslesProtectionAppointmentStandardDurationConfigApi(
    configuration,
  );
}

export function useOmsAppointmentStandardDurationConfigApi() {
  const configuration = useOmsConfiguration();
  return new OmsAppointmentStandardDurationConfigApi(configuration);
}

export function useStiProtectionAppointmentStandardDurationConfigApi() {
  const configuration = useStiProtectionConfiguration();
  return new StiProtectionAppointmentStandardDurationConfigApi(configuration);
}

export function useOpenDataConfigApi() {
  const configuration = useOpenDataConfiguration();
  return new OpenDataConfigApi(configuration);
}

export function useProstituteProtectionAppointmentStandardDurationConfigApi() {
  const configuration = useConfigurationByBusinessModule(
    ApiBusinessModule.ProstituteProtection,
    ProstituteProtectionConfiguration,
  );
  return new ProstituteProtectionAppointmentStandardDurationConfigApi(
    configuration,
  );
}

export function useProstituteProtectionAppointmentBlockAvailabilityApi() {
  const configuration = useConfigurationByBusinessModule(
    ApiBusinessModule.ProstituteProtection,
    ProstituteProtectionConfiguration,
  );
  return new ProstituteProtectionAppointmentBlockAvailabilityConfigApi(
    configuration,
  );
}

export function useInfectionBriefingAppointmentStandardDurationConfigApi() {
  const configuration = useConfigurationByBusinessModule(
    ApiBusinessModule.InfectionBriefing,
    InfectionBriefingConfiguration,
  );
  return new InfectionBriefingAppointmentStandardDurationConfigApi(
    configuration,
  );
}

export function useAddressRegistryConfigurationApi() {
  const configuration = useConfiguration();
  return new AddressDirectoryConfigApi(configuration);
}

export function useConfiguratorInfectionBriefingApi() {
  const configuration = useConfigurationByBusinessModule(
    ApiBusinessModule.InfectionBriefing,
    InfectionBriefingConfiguration,
  );
  return new InfectionBriefingConfigApi(configuration);
}
