/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Switch, Typography } from "@mui/joy";
import { ChangeEvent } from "react";

interface TextModuleToggleProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  count?: number;
}

export function TextModuleToggle({
  checked,
  onToggle,
  count,
}: Readonly<TextModuleToggleProps>) {
  return (
    <Typography
      component="label"
      startDecorator={
        <Switch
          checked={checked}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onToggle(event.target.checked)
          }
        />
      }
      sx={{ width: 200 }}
    >
      Textbausteine {!!count && `(${count})`}
    </Typography>
  );
}
