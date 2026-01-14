/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Box } from "@mui/joy";
import { useState } from "react";

import { IconButton } from "@eshg/lib-employee-portal";
import { InputField, InputFieldProps } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";

type PasswordInputProps = Omit<
  InputFieldProps,
  "type" | "untrimmedInput" | "label"
> & {
  label: string;
};

export function PasswordField(props: Readonly<PasswordInputProps>) {
  const [visible, setVisible] = useState(false);

  return (
    <Box role="group" aria-label={props.label}>
      <InputField
        {...props}
        type={visible ? "text" : "password"}
        untrimmedInput
        aria-label="Passwort"
        endDecorator={
          <IconButton
            sx={{
              backgroundColor: "transparent",
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            label={visible ? "Passwort verbergen" : "Passwort anzeigen"}
            disabled={false}
            onClick={() => setVisible((old) => !old)}
          >
            {visible ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
          </IconButton>
        }
        onBlur={() => setVisible(false)}
      />
    </Box>
  );
}
