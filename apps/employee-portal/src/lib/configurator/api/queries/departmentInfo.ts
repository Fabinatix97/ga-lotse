/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQueries } from "@tanstack/react-query";

import { ApiGetInternalConfigDepartmentInfoResponse } from "@eshg/base-api";
import { DepartmentInfoConfigApi } from "@eshg/lib-config-api";
import { SexWorkDepartmentInfoConfigApi } from "@eshg/sti-protection-api";

import { DepartmentInfoFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/DepartmentInfo";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorDepartmentInfoApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetDepartmentInfo(module: ConfiguratorModuleName) {
  const configuratorApi = useConfiguratorDepartmentInfoApi(module);
  const configuratorBaseApi = useConfiguratorDepartmentInfoApi("BASE");

  function createQuery(module: ConfiguratorModuleName) {
    return queryOptions({
      queryKey: configuratorApiQueryKey([
        module,
        configuratorApi,
        "getInternalConfigDepartmentInfo",
      ]),
      queryFn: () => {
        if (module === "SEX_WORK") {
          return (
            configuratorApi as SexWorkDepartmentInfoConfigApi
          ).getInternalConfigDepartmentInfo1();
        } else if (module === "BASE") {
          return (
            configuratorBaseApi as DepartmentInfoConfigApi
          ).getInternalConfigDepartmentInfo();
        }
        return (
          configuratorApi as DepartmentInfoConfigApi
        ).getInternalConfigDepartmentInfo();
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
    });
  }

  const results = useSuspenseQueries({
    queries: (module === "BASE" ? ["BASE"] : ["BASE", module]).map((name) =>
      createQuery(name as ConfiguratorModuleName),
    ),
  });

  return {
    baseValues: results[0]!.data,
    moduleValues: results[1]?.data,
  };
}
