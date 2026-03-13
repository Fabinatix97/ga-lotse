/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQueryClient } from "@tanstack/react-query";
import { Formik, FormikErrors, FormikProps } from "formik";
import { useRef, useState } from "react";
import { isEmpty } from "remeda";

import {
  ConfirmationDialog,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  type ApiAddSchoolEntryMeasurementDeviceRequest,
  ApiGdtDriver,
  ApiMeasuringDeviceType,
  ApiSchoolEntryMeasuringDevice,
  ApiUpdateSchoolEntryMeasurementDeviceRequest,
} from "@eshg/school-entry-api";

import {
  useDeleteMeasuringDevice,
  useUpdateMeasuringDevice,
} from "@/lib/configurator/api/mutations/useUpdateSchoolEntry";
import {
  validateEquipmentSelectorIsUniqueQuery,
  validateNameIsUniqueQuery,
} from "@/lib/configurator/api/queries/schoolEntry";
import { SidebarContent } from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/SidebarContent";
import { useSchoolEntryDeviceRegistryConfigApi } from "@/lib/shared/api/clients";

interface EditDeviceSidebarProps extends SidebarWithFormRefProps {
  device: ApiSchoolEntryMeasuringDevice;
}

export function useEditDeviceSidebar() {
  return useSidebarWithFormRef({
    component: EditDeviceSidebar,
  });
}

function EditDeviceSidebar({
  onClose,
  formRef,
  device,
}: EditDeviceSidebarProps) {
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const updateMeasurementDevice = useUpdateMeasuringDevice();
  const deleteMeasurementDevice = useDeleteMeasuringDevice();
  const formikRef = useRef<FormikProps<MeasurementDeviceForm>>(null);
  const queryClient = useQueryClient();
  const schoolEntryDeviceApi = useSchoolEntryDeviceRegistryConfigApi();

  async function onSubmit(
    values: MeasurementDeviceForm,
    errors: FormikErrors<MeasurementDeviceForm>,
    setErrors: (errors: FormikErrors<MeasurementDeviceForm>) => void,
  ) {
    if (!isEmpty(errors)) {
      return;
    }

    const isValid = await validateNameAndEquipmentSelectorUniqueness(
      values,
      setErrors,
    );
    if (!isValid) return;

    setEditConfirmOpen(true);
  }

  function onEditConfirm() {
    setEditConfirmOpen(false);
    void formikRef.current?.submitForm();
  }

  async function handleSubmit(values: MeasurementDeviceForm) {
    await updateMeasurementDevice.mutateAsync(
      {
        deviceId: device.externalId,
        request: mapDeviceFormToApi(values, device.version),
      },
      {
        onSuccess: () => {
          onClose(true);
        },
      },
    );
  }

  async function validateNameAndEquipmentSelectorUniqueness(
    values: MeasurementDeviceForm,
    setErrors: (errors: FormikErrors<MeasurementDeviceForm>) => void,
  ) {
    let isEquipmentSelectorUnique = true;
    let isNameUnique = true;

    if (values.equipmentSelector !== device.equipmentSelector) {
      isEquipmentSelectorUnique = await queryClient.fetchQuery(
        validateEquipmentSelectorIsUniqueQuery(
          schoolEntryDeviceApi,
          values.equipmentSelector,
        ),
      );
    }

    if (values.name !== device.name) {
      isNameUnique = await queryClient.fetchQuery(
        validateNameIsUniqueQuery(schoolEntryDeviceApi, values.name),
      );
    }

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

  async function handleDelete() {
    await deleteMeasurementDevice(device.externalId);
    setDeleteConfirmOpen(false);
    onClose(true);
  }

  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={mapDeviceApiToForm(device)}
        enableReinitialize
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ errors, values, setErrors }) => (
          <SidebarContent
            formRef={formRef}
            submitButtonType="button"
            onClose={onClose}
            onDelete={() => setDeleteConfirmOpen(true)}
            onSubmitClick={() => onSubmit(values, errors, setErrors)}
          />
        )}
      </Formik>
      <ConfirmationDialog
        open={editConfirmOpen}
        title="Änderungen speichern?"
        description="Die Änderung der Gerätekennung oder des Dateitreibers kann die
        Funktionalität der Verbindung beeinträchtigen. Bitte ändern Sie diese
        Einstellungen nur, wenn Sie genau wissen, was Sie tun."
        confirmLabel="Änderung bestätigen"
        onConfirm={onEditConfirm}
        onClose={() => setEditConfirmOpen(false)}
      />
      <ConfirmationDialog
        color="danger"
        title="Messgerät wirklich löschen?"
        description="Wenn Sie dieses Messgerät löschen, wird es aus der Konfiguration entfernt und kann nicht wiederhergestellt werden."
        confirmLabel="Löschen"
        open={deleteConfirmOpen}
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
}

interface MeasurementDeviceForm {
  deviceType: ApiMeasuringDeviceType;
  name: string;
  equipmentSelector: string;
  gdtDriver: ApiGdtDriver;
}

function mapDeviceApiToForm(
  api: ApiAddSchoolEntryMeasurementDeviceRequest,
): MeasurementDeviceForm {
  return {
    gdtDriver: api.gdtDriver,
    name: api.name,
    deviceType: api.deviceType,
    equipmentSelector: api.equipmentSelector,
  };
}

function mapDeviceFormToApi(
  form: MeasurementDeviceForm,
  version: number,
): ApiUpdateSchoolEntryMeasurementDeviceRequest {
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
    version,
  };
}
