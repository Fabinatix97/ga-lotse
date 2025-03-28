/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";

import {
  useBaseDepartmentInfoConfigApi,
  useMeaslesProtectionDepartmentInfoConfigApi,
  useMedicalRegistryDepartmentInfoConfigApi,
  useSchoolEntryDepartmentInfoConfigApi,
  useSexWorkDepartmentInfoConfigApi,
  useStiConsultationDepartmentInfoConfigApi,
  useTravelMedicineDepartmentInfoConfigApi,
} from "@/lib/configurator/api/clients";
import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";

import {
  baseDepartmentInfoConfigApiQueryKey,
  measlesProtectionDepartmentInfoConfigApiQueryKey,
  medicalRegistryDepartmentInfoConfigApiQueryKey,
  schoolEntryDepartmentInfoConfigApiQueryKey,
  sexWorkDepartmentInfoConfigApiQueryKey,
  stiConsultationDepartmentInfoConfigApiQueryKey,
  travelMedicineDepartmentInfoConfigApiQueryKey,
} from "./apiQueryKeys";

export function useGetDepartmentInfo(module: ConfiguratorModuleName) {
  const baseDepartmentInfoConfigApi = useBaseDepartmentInfoConfigApi();
  const measlesProtectionDepartmentInfoConfigApi =
    useMeaslesProtectionDepartmentInfoConfigApi();
  const medicalRegistryDepartmentInfoConfigApi =
    useMedicalRegistryDepartmentInfoConfigApi();
  const schoolEntryDepartmentInfoConfigApi =
    useSchoolEntryDepartmentInfoConfigApi();
  const sexWorkDepartmentInfoConfigApi = useSexWorkDepartmentInfoConfigApi();
  const stiConsultationDepartmentInfoConfigApi =
    useStiConsultationDepartmentInfoConfigApi();
  const travelMedicineDepartmentInfoConfigApi =
    useTravelMedicineDepartmentInfoConfigApi();

  return useSuspenseQuery({
    queryKey: getQueryKey(module),
    queryFn: () => {
      switch (module) {
        case "baseModule":
          return baseDepartmentInfoConfigApi.getInternalConfigDepartmentInfo();
        case "measlesProtection":
          return measlesProtectionDepartmentInfoConfigApi.getInternalConfigDepartmentInfo();
        case "medicalRegistry":
          return medicalRegistryDepartmentInfoConfigApi.getInternalConfigDepartmentInfo();
        case "schoolEntry":
          return schoolEntryDepartmentInfoConfigApi.getInternalConfigDepartmentInfo();
        case "sexWork":
          return sexWorkDepartmentInfoConfigApi.getInternalConfigDepartmentInfo1();
        case "stiProtection":
          return stiConsultationDepartmentInfoConfigApi.getInternalConfigDepartmentInfo();
        case "travelMedicine":
          return travelMedicineDepartmentInfoConfigApi.getInternalConfigDepartmentInfo();
      }
    },
  });
}

function getQueryKey(module: ConfiguratorModuleName): QueryKey {
  switch (module) {
    case "baseModule":
      return baseDepartmentInfoConfigApiQueryKey([
        "getInternalConfigDepartmentInfo",
      ]);
    case "measlesProtection":
      return measlesProtectionDepartmentInfoConfigApiQueryKey([
        "getInternalConfigDepartmentInfo",
      ]);
    case "medicalRegistry":
      return medicalRegistryDepartmentInfoConfigApiQueryKey([
        "getInternalConfigDepartmentInfo",
      ]);
    case "schoolEntry":
      return schoolEntryDepartmentInfoConfigApiQueryKey([
        "getInternalConfigDepartmentInfo",
      ]);
    case "sexWork":
      return sexWorkDepartmentInfoConfigApiQueryKey([
        "getInternalConfigDepartmentInfo1",
      ]);
    case "stiProtection":
      return stiConsultationDepartmentInfoConfigApiQueryKey([
        "getInternalConfigDepartmentInfo",
      ]);
    case "travelMedicine":
      return travelMedicineDepartmentInfoConfigApiQueryKey([
        "getInternalConfigDepartmentInfo",
      ]);
  }
}
