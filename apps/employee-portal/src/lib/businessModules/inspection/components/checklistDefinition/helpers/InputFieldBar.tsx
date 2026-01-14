/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

export interface InputFieldBarProps {
  startDecorator?: ReactNode;
  endDecorator?: ReactNode;
  sx?: SxProps;
}

export function InputFieldBar({
  input,
  startDecorator,
  endDecorator,
  sx,
}: Readonly<
  InputFieldBarProps & {
    input: ReactNode;
  }
>) {
  return (
    <Stack spacing={2} direction="row" sx={sx}>
      {startDecorator && (
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          sx={{
            mt: "1.7rem",
            // height of a 1 line input to center elements on the first line
            height: "2.25rem",
          }}
        >
          {startDecorator}
        </Stack>
      )}
      {input}
      {endDecorator && (
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          sx={{
            mt: "1.7rem",
            // height of a 1 line input to center elements on the first line
            height: "2.25rem",
          }}
        >
          {endDecorator}
        </Stack>
      )}
    </Stack>
  );
}
