/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, StackProps, Typography, TypographyProps } from "@mui/joy";
import { ComponentType, useId } from "react";
import { isString } from "remeda";

export interface DetailsItemProps<TLabelProps, TValueProps> {
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
    root?: StackProps;
  };
}

export function DetailsItem<
  TLabelProps = TypographyProps,
  TValueProps = TypographyProps,
>(props: DetailsItemProps<TLabelProps, TValueProps>) {
  const LabelComponent = props.slots?.label ?? DetailsItemLabel;
  const DefaultValueComponent = props.avoidWrap
    ? DetailsValueAvoidWrap
    : DetailsItemValue;
  const ValueComponent = props.slots?.value ?? DefaultValueComponent;

  const labelProps = props.slotProps?.label;
  const valueProps = props.slotProps?.value;

  const isValueEmpty =
    props.value === undefined ||
    (isString(props.value) && props.value.trim() === "");

  const id = useId();

  if (isValueEmpty) {
    return null;
  }

  return (
    <Stack gap={0.25} {...props.slotProps?.root}>
      <LabelComponent {...(labelProps as TLabelProps)} id={id}>
        {props.label}
      </LabelComponent>
      <ValueComponent {...(valueProps as TValueProps)} aria-labelledby={id}>
        {props.value}
      </ValueComponent>
    </Stack>
  );
}

export function DetailsItemLabel({ sx, ...props }: TypographyProps) {
  return (
    <Typography
      level="body-sm"
      textColor="text.secondary"
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

export function DetailsItemValue({ sx, ...props }: TypographyProps) {
  return (
    <Typography
      level="title-md"
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

export function DetailsValueAvoidWrap({ sx, ...props }: TypographyProps) {
  return <DetailsItemValue sx={{ width: "fit-content", ...sx }} {...props} />;
}
