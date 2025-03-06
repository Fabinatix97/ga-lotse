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
  /**
   * In the BITV-Test, it is sometimes required to have certain order for these buttons (tabs)
   * In some cases the DOM and focus order should be different from the visual order.
   * This parameter reorders the DOM without any visual changes.
   * https://bitvtest.de/pruefschritt/bitv-20-web/bitv-20-web-9-2-4-3-schluessige-reihenfolge-bei-der-tastaturbedienung
   */
  invertDomOrder?: boolean;
}

export function ButtonBar(props: Readonly<ButtonBarProps>) {
  return (
    <Stack
      direction="row"
      alignItems={props.alignItems ?? "center"}
      gap={3}
      flexWrap="wrap"
      {...(props.invertDomOrder
        ? {
            flexDirection: "row-reverse",
            sx: {
              ">:first-child": { justifyContent: "flex-end" },
              ">:last-child": { justifyContent: "flex-start" },
            },
          }
        : {})}
    >
      {isNonNullish(props.right) && props.invertDomOrder && (
        <ButtonStack justifyContent="flex-end">{props.right}</ButtonStack>
      )}
      {isNonNullish(props.left) && (
        <ButtonStack justifyContent="flex-start">{props.left}</ButtonStack>
      )}
      {isNonNullish(props.right) && !props.invertDomOrder && (
        <ButtonStack justifyContent="flex-end">{props.right}</ButtonStack>
      )}
    </Stack>
  );
}

function ButtonStack(props: StackProps) {
  return <Stack direction="row" gap={2} flexGrow={1} {...props} />;
}
