/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseDepartmentInfoConfigApi } from "@eshg/base-api";
import { DepartmentInfoConfigApi as MeaslesProtectionDepartmentInfoConfigApi } from "@eshg/measles-protection-api";
import { DepartmentInfoConfigApi as MedicalRegistryDepartmentInfoConfigApi } from "@eshg/medical-registry-api";
import { DepartmentInfoConfigApi as SchoolEntryDepartmentInfoConfigApi } from "@eshg/school-entry-api";
import {
  SexWorkDepartmentInfoConfigApi,
  StiConsultationDepartmentInfoConfigApi,
} from "@eshg/sti-protection-api";
import { DepartmentInfoConfigApi as TravelMedicineDepartmentInfoConfigApi } from "@eshg/travel-medicine-api";

import { useConfiguration as useBaseModuleConfiguration } from "@/lib/baseModule/api/clients";
import { useConfiguration as useMeaslesProtectionConfiguration } from "@/lib/businessModules/measlesProtection/api/clients";
import { useConfiguration as useMedicalRegistryConfiguration } from "@/lib/businessModules/medicalRegistry/api/clients";
import { useConfiguration as useSchoolEntryConfiguration } from "@/lib/businessModules/schoolEntry/api/clients";
import { useConfiguration as useStiProtectionConfiguration } from "@/lib/businessModules/stiProtection/api/clients";
import { useConfiguration as useTravelMedicineConfiguration } from "@/lib/businessModules/travelMedicine/api/clients";

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
