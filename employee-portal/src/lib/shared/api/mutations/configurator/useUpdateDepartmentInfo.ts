/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUpdateMandatoryInternalConfigDepartmentInfoRequest } from "@eshg/base-api";
import { DepartmentInfoConfigApi } from "@eshg/lib-config-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { SexWorkDepartmentInfoConfigApi } from "@eshg/sti-protection-api";

import { DepartmentInfoFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/DepartmentInfo";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorDepartmentInfoApi } from "@/lib/shared/api/clients";

function mapToApi(
  model: DepartmentInfoFormModel,
): ApiUpdateMandatoryInternalConfigDepartmentInfoRequest {
  return {
    departmentInfo: {
      abbreviation: model.abbreviation,
      city: model.city,
      email: model.email,
      homepage: model.homepage,
      houseNumber: model.houseNumber,
      name: model.departmentName,
      phoneNumber: model.phoneNumber,
      postalCode: model.postalCode,
      street: model.street,
      country: "DE", // Hardcoded for now
      latitude: model.latitude as number,
      longitude: model.longitude as number,
    },
  };
}

export function useUpdateDepartmentInfo(module: ConfiguratorModuleName) {
  const snackbar = useSnackbar();
  const configuratorApi = useConfiguratorDepartmentInfoApi(module);

  const mutation = useHandledMutation({
    mutationFn: (params: DepartmentInfoFormModel) => {
      if (module === "SEX_WORK") {
        return (
          configuratorApi as SexWorkDepartmentInfoConfigApi
        ).updateInternalConfigDepartmentInfo1(mapToApi(params));
      }
      return (
        configuratorApi as DepartmentInfoConfigApi
      ).updateInternalConfigDepartmentInfo(mapToApi(params));
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: DepartmentInfoFormModel) => {
    return mutation.mutateAsync(model);
  };
}
