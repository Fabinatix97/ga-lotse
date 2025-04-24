/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ConfigStatusApi as BaseConfigStatusApi,
  BaseDepartmentInfoConfigApi,
} from "@eshg/base-api";
import {
  ConfigStatusApi as MeaslesProtectionConfigStatusApi,
  DepartmentInfoConfigApi as MeaslesProtectionDepartmentInfoConfigApi,
} from "@eshg/measles-protection-api";
import {
  ConfigStatusApi as MedicalRegistryConfigStatusApi,
  DepartmentInfoConfigApi as MedicalRegistryDepartmentInfoConfigApi,
} from "@eshg/medical-registry-api";
import { ConfigStatusApi as OfficialMedicalServiceConfigStatusApi } from "@eshg/official-medical-service-api";
import { ConfigStatusApi as OpenDataConfigStatusApi } from "@eshg/opendata-api";
import {
  ConfigStatusApi as SchoolEntryConfigStatusApi,
  DepartmentInfoConfigApi as SchoolEntryDepartmentInfoConfigApi,
} from "@eshg/school-entry-api";
import {
  SexWorkConfigStatusApi,
  SexWorkDepartmentInfoConfigApi,
  StiConsultationConfigStatusApi,
  StiConsultationDepartmentInfoConfigApi,
} from "@eshg/sti-protection-api";
import {
  ConfigStatusApi as TravelMedicineConfigStatusApi,
  DepartmentInfoConfigApi as TravelMedicineDepartmentInfoConfigApi,
} from "@eshg/travel-medicine-api";

import { useConfiguration as useBaseModuleConfiguration } from "@/lib/baseModule/api/clients";
import { useConfiguration as useMeaslesProtectionConfiguration } from "@/lib/businessModules/measlesProtection/api/clients";
import { useConfiguration as useMedicalRegistryConfiguration } from "@/lib/businessModules/medicalRegistry/api/clients";
import { useConfiguration as useOfficialMedicalServiceConfiguration } from "@/lib/businessModules/officialMedicalService/api/clients";
import { useConfiguration as useSchoolEntryConfiguration } from "@/lib/businessModules/schoolEntry/api/clients";
import { useConfiguration as useStiProtectionConfiguration } from "@/lib/businessModules/stiProtection/api/clients";
import { useConfiguration as useTravelMedicineConfiguration } from "@/lib/businessModules/travelMedicine/api/clients";
import { useConfiguration as useOpendataConfiguration } from "@/lib/opendata/api/clients";

// module status
export function useBaseConfigStatusApi() {
  const configuration = useBaseModuleConfiguration();
  return new BaseConfigStatusApi(configuration);
}

export function useMeaslesProtectionConfigStatusApi() {
  const configuration = useMeaslesProtectionConfiguration();
  return new MeaslesProtectionConfigStatusApi(configuration);
}

export function useMedicalRegistryConfigStatusApi() {
  const configuration = useMedicalRegistryConfiguration();
  return new MedicalRegistryConfigStatusApi(configuration);
}

export function useOfficialMedicalServiceConfigStatusApi() {
  const configuration = useOfficialMedicalServiceConfiguration();
  return new OfficialMedicalServiceConfigStatusApi(configuration);
}

export function useOpenDataConfigStatusApi() {
  const configuration = useOpendataConfiguration();
  return new OpenDataConfigStatusApi(configuration);
}

export function useSchoolEntryConfigStatusApi() {
  const configuration = useSchoolEntryConfiguration();
  return new SchoolEntryConfigStatusApi(configuration);
}

export function useSexWorkConfigStatusApi() {
  const configuration = useStiProtectionConfiguration();
  return new SexWorkConfigStatusApi(configuration);
}

export function useStiProtectionConfigStatusApi() {
  const configuration = useStiProtectionConfiguration();
  return new StiConsultationConfigStatusApi(configuration);
}

export function useTravelMedicineConfigStatusApi() {
  const configuration = useTravelMedicineConfiguration();
  return new TravelMedicineConfigStatusApi(configuration);
}

// department info
export function useBaseDepartmentInfoConfigApi() {
  const configuration = useBaseModuleConfiguration();
  return new BaseDepartmentInfoConfigApi(configuration);
}

export function useMeaslesProtectionDepartmentInfoConfigApi() {
  const configuration = useMeaslesProtectionConfiguration();
  return new MeaslesProtectionDepartmentInfoConfigApi(configuration);
}

export function useMedicalRegistryDepartmentInfoConfigApi() {
  const configuration = useMedicalRegistryConfiguration();
  return new MedicalRegistryDepartmentInfoConfigApi(configuration);
}

export function useSchoolEntryDepartmentInfoConfigApi() {
  const configuration = useSchoolEntryConfiguration();
  return new SchoolEntryDepartmentInfoConfigApi(configuration);
}

export function useStiConsultationDepartmentInfoConfigApi() {
  const configuration = useStiProtectionConfiguration();
  return new StiConsultationDepartmentInfoConfigApi(configuration);
}

export function useSexWorkDepartmentInfoConfigApi() {
  const configuration = useStiProtectionConfiguration();
  return new SexWorkDepartmentInfoConfigApi(configuration);
}

export function useTravelMedicineDepartmentInfoConfigApi() {
  const configuration = useTravelMedicineConfiguration();
  return new TravelMedicineDepartmentInfoConfigApi(configuration);
}
