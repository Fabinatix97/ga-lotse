/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetInternalConfigDepartmentInfoResponse } from "@eshg/base-api";
import { QueryKey, useSuspenseQueries } from "@tanstack/react-query";

import {
  useBaseDepartmentInfoConfigApi,
  useMeaslesProtectionDepartmentInfoConfigApi,
  useMedicalRegistryDepartmentInfoConfigApi,
  useSchoolEntryDepartmentInfoConfigApi,
  useSexWorkDepartmentInfoConfigApi,
  useStiConsultationDepartmentInfoConfigApi,
  useTravelMedicineDepartmentInfoConfigApi,
} from "@/lib/configurator/api/clients";
import {
  DepartmentInfoFormModel,
  DepartmentInfoModuleName,
} from "@/lib/configurator/components/shared/ConfiguratorDetails/DepartmentInfo";

import {
  baseDepartmentInfoConfigApiQueryKey,
  measlesProtectionDepartmentInfoConfigApiQueryKey,
  medicalRegistryDepartmentInfoConfigApiQueryKey,
  schoolEntryDepartmentInfoConfigApiQueryKey,
  sexWorkDepartmentInfoConfigApiQueryKey,
  stiConsultationDepartmentInfoConfigApiQueryKey,
  travelMedicineDepartmentInfoConfigApiQueryKey,
} from "./apiQueryKeys";

export function useGetDepartmentInfo(module: DepartmentInfoModuleName) {
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

  function createQuery(moduleName: DepartmentInfoModuleName) {
    return {
      queryKey: getQueryKey(moduleName),
      queryFn: () => {
        switch (moduleName) {
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
      select: (data: ApiGetInternalConfigDepartmentInfoResponse) =>
        ({
          useInfoOfHealthDepartment: "DEFAULT",
          departmentName: data.departmentInfo?.name ?? "",
          abbreviation: data.departmentInfo?.abbreviation ?? "",
          street: data.departmentInfo?.street ?? "",
          houseNumber: data.departmentInfo?.houseNumber ?? "",
          postalCode: data.departmentInfo?.postalCode ?? "",
          city: data.departmentInfo?.city ?? "",
          phoneNumber: data.departmentInfo?.phoneNumber ?? "",
          homepage: data.departmentInfo?.homepage ?? "",
          email: data.departmentInfo?.email ?? "",
          latitude: data.departmentInfo?.latitude ?? "",
          longitude: data.departmentInfo?.longitude ?? "",
        }) satisfies DepartmentInfoFormModel,
    };
  }

  const [baseResult, moduleResult] = useSuspenseQueries({
    queries: [createQuery("baseModule"), createQuery(module)],
  });

  return {
    baseValues: baseResult.data,
    moduleValues: moduleResult.data,
  };
}

function getQueryKey(module: DepartmentInfoModuleName): QueryKey {
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
