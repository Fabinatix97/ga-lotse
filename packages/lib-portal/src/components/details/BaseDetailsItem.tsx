/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, StackProps, Typography, TypographyProps } from "@mui/joy";
import { ComponentType, useId } from "react";
import { isString } from "remeda";

import { useInDetailsList } from "./DetailsList";

export interface BaseDetailsItemProps<TLabelProps, TValueProps> {
  label: TypographyProps["children"];
  value: TypographyProps["children"] | undefined;

  avoidWrap?: boolean;

  slots?: {
    label?: ComponentType<TLabelProps>;
    value?: ComponentType<TValueProps>;
  };
  slotProps?: {
    label?: Omit<TLabelProps, "children">;
    value?: Omit<TValueProps, "children">;
    stack?: StackProps;
  };
}

export function BaseDetailsItem<
  TLabelProps = TypographyProps,
  TValueProps = TypographyProps,
>(props: BaseDetailsItemProps<TLabelProps, TValueProps>) {
  const LabelComponent = props.slots?.label ?? BaseDetailsItemLabel;
  const DefaultValueComponent = props.avoidWrap
    ? DetailsValueAvoidWrap
    : BaseDetailsItemValue;
  const ValueComponent = props.slots?.value ?? DefaultValueComponent;

  const labelProps = props.slotProps?.label;
  const valueProps = props.slotProps?.value;

  const isValueEmpty =
    props.value === undefined ||
    (isString(props.value) && props.value.trim() === "");

  const id = useId();
  const inDetailsList = useInDetailsList();

  if (isValueEmpty) {
    return null;
  }

  return (
    <Stack gap={0.25} {...props.slotProps?.stack}>
      <LabelComponent
        {...(labelProps as TLabelProps)}
        id={!inDetailsList ? id : undefined}
        component={inDetailsList ? "dt" : undefined}
      >
        {props.label}
      </LabelComponent>
      <ValueComponent
        {...(valueProps as TValueProps)}
        aria-labelledby={!inDetailsList ? id : undefined}
        component={inDetailsList ? "dd" : undefined}
      >
        {props.value}
      </ValueComponent>
    </Stack>
  );
}

export function BaseDetailsItemLabel({ sx, ...props }: TypographyProps) {
  return (
    <Typography
      noWrap
      sx={{
        width: "fit-content",
        maxWidth: "100%",
        ...sx,
      }}
      {...props}
    />
  );
}

export function BaseDetailsItemValue({ sx, ...props }: TypographyProps) {
  return (
    <Typography
      sx={{
        hyphens: "auto",
        textWrap: "pretty",
        wordBreak: "normal",
        overflowWrap: "anywhere",
        ...sx,
      }}
      {...props}
    />
  );
}

function DetailsValueAvoidWrap({ sx, ...props }: TypographyProps) {
  return (
    <BaseDetailsItemValue sx={{ width: "fit-content", ...sx }} {...props} />
  );
}
