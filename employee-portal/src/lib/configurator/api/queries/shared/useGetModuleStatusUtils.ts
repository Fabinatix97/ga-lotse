/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { QueryKey } from "@tanstack/react-query";

import {
  useBaseConfigStatusApi,
  useMeaslesProtectionConfigStatusApi,
  useMedicalRegistryConfigStatusApi,
  useOfficialMedicalServiceConfigStatusApi,
  useOpenDataConfigStatusApi,
  useSchoolEntryConfigStatusApi,
  useSexWorkConfigStatusApi,
  useStiProtectionConfigStatusApi,
  useTravelMedicineConfigStatusApi,
} from "@/lib/configurator/api/clients";
import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import {
  baseConfigStatusApiQueryKey,
  measlesProtectionConfigStatusApiQueryKey,
  medicalRegistryConfigStatusApiQueryKey,
  officialMedicalServiceConfigStatusApiQueryKey,
  openDataConfigStatusApiQueryKey,
  schoolEntryConfigStatusApiQueryKey,
  sexWorkConfigStatusApiQueryKey,
  stiConsultationConfigStatusApiQueryKey,
  travelMedicineConfigStatusApiQueryKey,
} from "@/lib/configurator/api/queries/apiQueryKeys";

export function useGetModuleStatusUtils() {
  const baseConfigStatusApi = useBaseConfigStatusApi();
  const measlesProtectionConfigStatusApi =
    useMeaslesProtectionConfigStatusApi();
  const medicalRegistryConfigStatusApi = useMedicalRegistryConfigStatusApi();
  const officialMedicalServiceConfigStatusApi =
    useOfficialMedicalServiceConfigStatusApi();
  const openDataConfigStatusApi = useOpenDataConfigStatusApi();
  const schoolEntryConfigStatusApi = useSchoolEntryConfigStatusApi();
  const sexWorkConfigStatusApi = useSexWorkConfigStatusApi();
  const stiProtectionConfigStatusApi = useStiProtectionConfigStatusApi();
  const travelMedicineConfigStatusApi = useTravelMedicineConfigStatusApi();

  function createQuery(moduleName: ConfiguratorModuleName) {
    return {
      queryKey: getQueryKey(moduleName),
      queryFn: () => {
        switch (moduleName) {
          case "baseModule":
            return baseConfigStatusApi.getConfiguration();
          case "measlesProtection":
            return measlesProtectionConfigStatusApi.getConfiguration();
          case "medicalRegistry":
            return medicalRegistryConfigStatusApi.getConfiguration();
          case "officialMedicalService":
            return officialMedicalServiceConfigStatusApi.getConfiguration();
          case "opendata":
            return openDataConfigStatusApi.getConfiguration();
          case "schoolEntry":
            return schoolEntryConfigStatusApi.getConfiguration();
          case "sexWork":
            return sexWorkConfigStatusApi.getConfiguration1();
          case "stiProtection":
            return stiProtectionConfigStatusApi.getConfiguration();
          case "travelMedicine":
            return travelMedicineConfigStatusApi.getConfiguration();
        }
      },
    };
  }

  return { createQuery: createQuery };
}

export function getQueryKey(module: ConfiguratorModuleName): QueryKey {
  switch (module) {
    case "baseModule":
      return baseConfigStatusApiQueryKey(["getConfiguration"]);
    case "measlesProtection":
      return measlesProtectionConfigStatusApiQueryKey(["getConfiguration"]);
    case "medicalRegistry":
      return medicalRegistryConfigStatusApiQueryKey(["getConfiguration"]);
    case "officialMedicalService":
      return officialMedicalServiceConfigStatusApiQueryKey([
        "getConfiguration",
      ]);
    case "opendata":
      return openDataConfigStatusApiQueryKey(["getConfiguration"]);
    case "schoolEntry":
      return schoolEntryConfigStatusApiQueryKey(["getConfiguration"]);
    case "sexWork":
      return sexWorkConfigStatusApiQueryKey(["getConfiguration_1"]);
    case "stiProtection":
      return stiConsultationConfigStatusApiQueryKey(["getConfiguration"]);
    case "travelMedicine":
      return travelMedicineConfigStatusApiQueryKey(["getConfiguration"]);
  }
}
