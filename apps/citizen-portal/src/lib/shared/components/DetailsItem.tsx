/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, StackProps, TypographyProps } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { ReactNode } from "react";

import {
  BaseDetailsItem,
  BaseDetailsItemLabel,
  BaseDetailsItemProps,
  BaseDetailsItemValue,
} from "@eshg/lib-portal";

interface DetailsItemProps<
  TLabelProps extends TypographyProps,
  TValueProps extends TypographyProps,
> extends Omit<BaseDetailsItemProps<TLabelProps, TValueProps>, "slotProps"> {
  icon?: ReactNode;
  hiddenLabel?: boolean;
  slotProps?: {
    label?: Omit<TLabelProps, "children">;
    value?: Omit<TValueProps, "children">;
    stack?: StackProps;
    root?: StackProps;
  };
}

export function DetailsItem<
  TLabelProps extends TypographyProps,
  TValueProps extends TypographyProps,
>({
  hiddenLabel = false,
  ...props
}: DetailsItemProps<TLabelProps, TValueProps>) {
  const isVisuallyHidden = hiddenLabel ? visuallyHidden : undefined;

  const LabelComponent = props.slots?.label ?? DetailsItemLabelCitizen;
  const ValueComponent = props.slots?.value ?? DetailsItemValueCitizen;

  const labelProps = { sx: isVisuallyHidden, ...props.slotProps?.label };
  const stackProps = props.slotProps?.stack;

  return (
    <Stack
      direction="row"
      gap={2}
      sx={{ ...props.slotProps?.root?.sx }}
      {...props.slotProps?.root}
    >
      {props.icon}
      <BaseDetailsItem
        {...props}
        slots={{ label: LabelComponent, value: ValueComponent }}
        slotProps={{
          stack: {
            gap: 0.5,
            ...stackProps,
            sx: {
              overflow: "hidden",
              flexGrow: 1,
              ...stackProps?.sx,
            },
          },
          label: { ...(labelProps as TLabelProps) },
          ...props.slotProps,
        }}
      />
    </Stack>
  );
}

export function DetailsItemLabelCitizen(props: Omit<TypographyProps, "level">) {
  return <BaseDetailsItemLabel level="title-md" {...props} />;
}

export function DetailsItemValueCitizen(props: Omit<TypographyProps, "level">) {
  return <BaseDetailsItemValue level="body-md" {...props} />;
}
