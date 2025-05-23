/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useState } from "react";

import { IconButton } from "@eshg/lib-employee-portal";
import { InputField, InputFieldProps } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";

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
      onBlur={() => setVisible(false)}
    />
  );
}
