/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Switch } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";

import { BaseField, FieldProps, useBaseField } from "@eshg/lib-portal";

import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";

interface SwitchFieldProps extends FieldProps<boolean> {
  sx?: SxProps;
}

export function MainContactSwitchField(props: SwitchFieldProps) {
  const field = useBaseField<boolean>(props);
  const formikContext = useFormikContext<DefaultFacilityFormValues>();

  return (
    <BaseField
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        ...props.sx,
      }}
    >
      <Switch
        size="lg"
        checked={field.input.value}
        onChange={(checked) => {
          if (checked.target.checked) {
            for (
              let index = 0;
              index < formikContext.values.contactPersons.length;
              index++
            ) {
              void formikContext.setFieldValue(
                `contactPersons.${index}.mainContact`,
                false,
              );
            }
          }
          void field.helpers.setValue(checked.target.checked);
        }}
      />
    </BaseField>
  );
}
