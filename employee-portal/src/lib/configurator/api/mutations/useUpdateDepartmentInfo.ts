/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUpdateMandatoryInternalConfigDepartmentInfoRequest } from "@eshg/base-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

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
import { DepartmentInfoFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/DepartmentInfo";

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

  const mutation = useHandledMutation({
    mutationFn: (params: DepartmentInfoFormModel) => {
      switch (module) {
        case "baseModule":
          return baseDepartmentInfoConfigApi.updateInternalConfigDepartmentInfo(
            mapToApi(params),
          );
        case "measlesProtection":
          return measlesProtectionDepartmentInfoConfigApi.updateInternalConfigDepartmentInfo(
            mapToApi(params),
          );
        case "medicalRegistry":
          return medicalRegistryDepartmentInfoConfigApi.updateInternalConfigDepartmentInfo(
            mapToApi(params),
          );
        case "schoolEntry":
          return schoolEntryDepartmentInfoConfigApi.updateInternalConfigDepartmentInfo(
            mapToApi(params),
          );
        case "sexWork":
          return sexWorkDepartmentInfoConfigApi.updateInternalConfigDepartmentInfo1(
            mapToApi(params),
          );
        case "stiProtection":
          return stiConsultationDepartmentInfoConfigApi.updateInternalConfigDepartmentInfo(
            mapToApi(params),
          );
        case "travelMedicine":
          return travelMedicineDepartmentInfoConfigApi.updateInternalConfigDepartmentInfo(
            mapToApi(params),
          );
        default:
          throw new Error(`${module} is not implemented!`);
      }
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: DepartmentInfoFormModel) => {
    return mutation.mutateAsync(model);
  };
}
