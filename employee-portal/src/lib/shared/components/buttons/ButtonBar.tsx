/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, StackProps } from "@mui/joy";
import { ReactNode } from "react";
import { isNonNullish } from "remeda";

export interface ButtonBarProps {
  left?: ReactNode | ReactNode[];
  right?: ReactNode | ReactNode[];
  alignItems?: StackProps["alignItems"];
}

export function ButtonBar(props: Readonly<ButtonBarProps>) {
  return (
    <Stack
      direction="row"
      alignItems={props.alignItems ?? "center"}
      gap={3}
      flexWrap="wrap"
    >
      {isNonNullish(props.left) && (
        <ButtonStack justifyContent="flex-start">{props.left}</ButtonStack>
      )}
      {isNonNullish(props.right) && (
        <ButtonStack justifyContent="flex-end">{props.right}</ButtonStack>
      )}
    </Stack>
  );
}

function ButtonStack(props: StackProps) {
  return <Stack direction="row" gap={2} flexGrow={1} {...props} />;
}
