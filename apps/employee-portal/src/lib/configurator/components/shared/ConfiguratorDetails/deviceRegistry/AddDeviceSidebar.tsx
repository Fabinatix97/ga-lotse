/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQueryClient } from "@tanstack/react-query";
import { Formik, FormikHelpers } from "formik";

import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  type ApiAddSchoolEntryMeasurementDeviceRequest,
  ApiGdtDriver,
  ApiMeasuringDeviceType,
} from "@eshg/school-entry-api";

import { useCreateMeasuringDevice } from "@/lib/configurator/api/mutations/useUpdateSchoolEntry";
import {
  validateEquipmentSelectorIsUniqueQuery,
  validateNameIsUniqueQuery,
} from "@/lib/configurator/api/queries/schoolEntry";
import { SidebarContent } from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/SidebarContent";
import { useSchoolEntryDeviceRegistryConfigApi } from "@/lib/shared/api/clients";

export interface MeasurementDeviceForm {
  deviceType: ApiMeasuringDeviceType | null;
  name: string;
  equipmentSelector: string;
  gdtDriver: ApiGdtDriver | null;
}

export const INITIAL_VALUES: MeasurementDeviceForm = {
  deviceType: null,
  name: "",
  equipmentSelector: "",
  gdtDriver: null,
};

export function useAddDeviceSidebar() {
  return useSidebarWithFormRef({
    component: AddDeviceSidebar,
  });
}

function AddDeviceSidebar({ onClose, formRef }: SidebarWithFormRefProps) {
  const createMeasuringDevice = useCreateMeasuringDevice();
  const queryClient = useQueryClient();
  const schoolEntryDeviceApi = useSchoolEntryDeviceRegistryConfigApi();
  async function handleSubmit(
    values: MeasurementDeviceForm,
    helpers: FormikHelpers<MeasurementDeviceForm>,
  ) {
    const isValid = await validateNameAndEquipmentSelectorUniqueness(
      values,
      helpers,
    );
    if (!isValid) return;

    await createMeasuringDevice.mutateAsync(mapDeviceFormToApi(values), {
      onSuccess: () => {
        helpers.resetForm();
        onClose(true);
      },
    });
  }

  async function validateNameAndEquipmentSelectorUniqueness(
    values: MeasurementDeviceForm,
    { setErrors }: FormikHelpers<MeasurementDeviceForm>,
  ) {
    const isEquipmentSelectorUnique = await queryClient.fetchQuery(
      validateEquipmentSelectorIsUniqueQuery(
        schoolEntryDeviceApi,
        values.equipmentSelector,
      ),
    );
    const isNameUnique = await queryClient.fetchQuery(
      validateNameIsUniqueQuery(schoolEntryDeviceApi, values.name),
    );
    const errors = {
      ...(!isNameUnique && { name: "Name ist bereits vergeben." }),
      ...(!isEquipmentSelectorUnique && {
        equipmentSelector: "Gerätekennung ist bereits vergeben.",
      }),
    };

    if (Object.keys(errors).length) {
      setErrors(errors);
      return false;
    }
    return true;
  }

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      <SidebarContent
        formRef={formRef}
        submitLabel="Hinzufügen"
        onClose={onClose}
      />
    </Formik>
  );
}

export function mapDeviceFormToApi(
  form: MeasurementDeviceForm,
): ApiAddSchoolEntryMeasurementDeviceRequest {
  if (!form.deviceType) {
    throw new Error("Device type must be defined");
  }
  if (!form.equipmentSelector) {
    throw new Error("Equipment selector must be defined");
  }
  if (!form.gdtDriver) {
    throw new Error("GDT file driver must be defined");
  }
  if (!form.name) {
    throw new Error("Name must be defined");
  }

  return {
    gdtDriver: form.gdtDriver,
    name: form.name,
    deviceType: form.deviceType,
    equipmentSelector: form.equipmentSelector,
  };
}
