/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, StackProps } from "@mui/joy";
import { FormEventHandler, ReactNode } from "react";

import { FormPlus } from "@eshg/lib-portal";

interface FormStackProps extends Omit<StackProps<"form">, "component"> {
  dense?: boolean;
  divider?: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function FormStack(props: FormStackProps) {
  return (
    <Stack
      component={FormPlus}
      gap={props.dense ? 2 : 3}
      divider={props.divider}
      aria-label={props["aria-label"]}
    >
      {props.children}
    </Stack>
  );
}
