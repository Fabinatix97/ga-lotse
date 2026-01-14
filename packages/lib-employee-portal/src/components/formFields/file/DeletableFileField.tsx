/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Close } from "@mui/icons-material";
import { IconButton, Input } from "@mui/joy";
import { useFormikContext } from "formik";
import { isNonNullish } from "remeda";

import { InputField } from "@eshg/lib-portal";

import { FileField, FileFieldProps } from "./FileField";

export function DeletableFileField(
  props: Readonly<Omit<FileFieldProps, "label">> & {
    label: string;
  },
) {
  const { getFieldProps, setFieldValue } = useFormikContext();
  const { value } = getFieldProps<File>(props.name);
  const fileName = value?.name;

  return isNonNullish(fileName) ? (
    <InputField
      name={props.name}
      label={props.label}
      required={props.required}
      input={() => (
        <Input
          variant="outlined"
          color="neutral"
          endDecorator={
            <IconButton
              aria-label="Löschen"
              variant="plain"
              color="neutral"
              onClick={() => setFieldValue(props.name, null)}
            >
              <Close />
            </IconButton>
          }
          value={fileName}
          readOnly
          size="md"
        />
      )}
    />
  ) : (
    <FileField {...props} />
  );
}
