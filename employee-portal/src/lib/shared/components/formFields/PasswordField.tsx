/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  InputField,
  InputFieldProps,
} from "@eshg/lib-portal/components/formFields/InputField";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useState } from "react";

import { theme } from "@/lib/baseModule/theme/theme";
import { IconButton } from "@/lib/shared/components/pagination/IconButton";

type PasswordInputProps = Omit<InputFieldProps, "type" | "untrimmedInput"> & {
  visibilityLabel?: string;
};

export function PasswordField(props: Readonly<PasswordInputProps>) {
  const [visible, setVisible] = useState(false);

  return (
    <InputField
      {...props}
      type={visible ? "text" : "password"}
      untrimmedInput
      onBlur={() => setVisible(false)}
      endDecorator={
        <IconButton
          sx={{
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
          label={props.visibilityLabel ?? (visible ? "Verstecken" : "Anzeigen")}
          disabled={false}
          onClick={() => setVisible((old) => !old)}
        >
          {visible ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
        </IconButton>
      }
    />
  );
}
