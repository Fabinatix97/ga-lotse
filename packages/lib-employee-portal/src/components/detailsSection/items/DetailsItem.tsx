/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { TypographyProps } from "@mui/joy";

import {
  BaseDetailsItem,
  BaseDetailsItemLabel,
  BaseDetailsItemProps,
  BaseDetailsItemValue,
} from "@eshg/lib-portal/components/details/BaseDetailsItem";

export function DetailsItem<
  TLabelProps extends TypographyProps,
  TValueProps extends TypographyProps,
>(props: BaseDetailsItemProps<TLabelProps, TValueProps>) {
  const LabelComponent = props.slots?.label ?? DetailsItemLabelEmployee;
  const ValueComponent = props.slots?.value ?? DetailsItemValueEmployee;

  const stackProps = props.slotProps?.stack;

  return (
    <BaseDetailsItem
      {...props}
      slots={{ label: LabelComponent, value: ValueComponent }}
      slotProps={{
        stack: { gap: 0.25, ...stackProps },
        ...props.slotProps,
      }}
    />
  );
}

function DetailsItemLabelEmployee(props: Omit<TypographyProps, "level">) {
  return (
    <BaseDetailsItemLabel
      level="body-sm"
      textColor="text.secondary"
      {...props}
    />
  );
}

export function DetailsItemValueEmployee(
  props: Omit<TypographyProps, "level">,
) {
  return <BaseDetailsItemValue level="title-md" {...props} />;
}
