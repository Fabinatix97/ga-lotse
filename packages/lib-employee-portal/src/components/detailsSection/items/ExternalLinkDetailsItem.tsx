/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { TypographyProps } from "@mui/joy";
import { ComponentProps } from "react";
import { isString } from "remeda";

import { DetailsItem, DetailsItemProps, DetailsItemValue } from "./DetailsItem";

type ReducedItemProps<TLabelProps> = Omit<
  DetailsItemProps<
    TLabelProps,
    ComponentProps<typeof DetailsValueExternalLink>
  >,
  "value"
>;

interface ExternalLinkDetailsItemProps<TLabelProps>
  extends ReducedItemProps<TLabelProps> {
  value: string | undefined;
  href: (value: string) => string;
}

export function ExternalLinkDetailsItem<TLabelProps = TypographyProps>(
  props: ExternalLinkDetailsItemProps<TLabelProps>,
) {
  return (
    <DetailsItem
      {...props}
      slots={{
        ...props.slots,
        value: DetailsValueExternalLink,
      }}
      slotProps={{
        ...props.slotProps,
        value: {
          href: props.href,
          ...props.slotProps?.value,
        },
      }}
    />
  );
}

function DetailsValueExternalLink({
  children,
  href,
  ...props
}: TypographyProps & {
  href: (value: string) => string;
}) {
  return (
    <DetailsItemValue {...props}>
      <ExternalLink
        href={isString(children) ? href(children) : undefined}
        sx={{ wordBreak: "break-word", hyphens: "manual" }}
      >
        {children}
      </ExternalLink>
    </DetailsItemValue>
  );
}
