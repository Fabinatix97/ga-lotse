/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, StackProps, Typography, TypographyProps } from "@mui/joy";
import { ComponentType, ReactNode, useId } from "react";
import { isString } from "remeda";

import { SectionStack } from "@/lib/shared/components/infoSection";

export interface DetailsItemProps<TLabelProps, TValueProps> {
  label: TypographyProps["children"];
  value: TypographyProps["children"] | undefined;
  icon?: ReactNode;

  slots?: {
    label?: ComponentType<TLabelProps>;
    value?: ComponentType<TValueProps>;
  };
  slotProps?: {
    label?: Omit<TLabelProps, "children">;
    value?: Omit<TValueProps, "children">;
    stack?: StackProps;
    root?: StackProps;
  };
}

export function DetailsItem<
  TLabelProps = TypographyProps,
  TValueProps = TypographyProps,
>(props: DetailsItemProps<TLabelProps, TValueProps>) {
  const LabelComponent = props.slots?.label ?? DetailsItemLabel;
  const DefaultValueComponent = DetailsItemValue;
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
    <SectionStack
      component="section"
      direction="row"
      gap={2}
      sx={{ ...props.slotProps?.root?.sx }}
    >
      {props.icon}
      <Stack
        gap={0.5}
        {...props.slotProps?.stack}
        sx={{
          overflow: "hidden",
          flexGrow: 1,
          ...props.slotProps?.stack?.sx,
        }}
      >
        <LabelComponent {...(labelProps as TLabelProps)} id={id}>
          {props.label}
        </LabelComponent>
        <ValueComponent {...(valueProps as TValueProps)} aria-labelledby={id}>
          {props.value}
        </ValueComponent>
      </Stack>
    </SectionStack>
  );
}

export function DetailsItemLabel({ sx, ...props }: TypographyProps) {
  return (
    <Typography
      level="title-md"
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
      level="body-md"
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
