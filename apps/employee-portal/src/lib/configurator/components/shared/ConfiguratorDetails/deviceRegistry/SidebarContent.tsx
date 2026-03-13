/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  SidebarActions,
  SidebarForm,
  SidebarContent as SidebarLayout,
  SidebarWithFormRefProps,
} from "@eshg/lib-employee-portal";
import {
  InputField,
  SelectField,
  createFieldNameMapper,
  useValidateLength,
} from "@eshg/lib-portal";

import { MeasurementDeviceForm } from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/AddDeviceSidebar";
import { MultiFormButtonBar } from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/MultiFormButtonBar";
import {
  DEVICE_TYPE_OPTIONS,
  GDT_FILE_DRIVER_OPTIONS,
} from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/constants";
import { useValidateEquipmentSelector } from "@/lib/configurator/components/shared/hooks/useValidateEquipmentSelector";

interface DeviceSidebarContentProps extends SidebarWithFormRefProps {
  submitLabel?: string;
  submitButtonType?: "button" | "submit";
  onDelete?: () => void;
  onSubmitClick?: () => void;
}

export function SidebarContent({
  onClose,
  formRef,
  submitLabel = "Speichern",
  submitButtonType,
  onSubmitClick,
  onDelete,
}: DeviceSidebarContentProps) {
  const validateLength = useValidateLength();
  const validateEquipmentSelector = useValidateEquipmentSelector();
  const fieldName = createFieldNameMapper<MeasurementDeviceForm>();
  const { isSubmitting } = useFormikContext<MeasurementDeviceForm>();

  return (
    <SidebarForm ref={formRef}>
      <SidebarLayout title="Messgerät">
        <Stack gap={2}>
          <SelectField
            autoFocus
            options={DEVICE_TYPE_OPTIONS}
            name={fieldName("deviceType")}
            label="Art"
            required="Bitte die Art des Geräts angeben"
          />
          <InputField
            name={fieldName("equipmentSelector")}
            label="Gerätekennung"
            required="Bitte eine Gerätekennung angeben"
            validate={validateEquipmentSelector}
          />
          <InputField
            name={fieldName("name")}
            label="Name"
            required="Bitte einen Namen angeben"
            validate={validateLength(1, 120)}
          />
          <SelectField
            options={GDT_FILE_DRIVER_OPTIONS}
            name={fieldName("gdtDriver")}
            required="Bitte einen GDT-Treiber angeben"
            label="GDT-Treiber"
          />
        </Stack>
      </SidebarLayout>
      <SidebarActions>
        <MultiFormButtonBar
          submitLabel={submitLabel}
          submitting={isSubmitting}
          submitButtonType={submitButtonType}
          onCancel={() => onClose(false)}
          onDelete={onDelete}
          onSubmitClick={onSubmitClick}
        />
      </SidebarActions>
    </SidebarForm>
  );
}
