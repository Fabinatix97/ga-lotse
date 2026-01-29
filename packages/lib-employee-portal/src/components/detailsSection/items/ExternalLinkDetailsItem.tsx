/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { TypographyProps } from "@mui/joy";
import { ComponentProps } from "react";
import { isString } from "remeda";

import { BaseDetailsItemProps, ExternalLink } from "@eshg/lib-portal";

import { DetailsItem, DetailsItemValueEmployee } from "./DetailsItem";

type ReducedItemProps<TLabelProps> = Omit<
  BaseDetailsItemProps<
    TLabelProps,
    ComponentProps<typeof DetailsValueExternalLink>
  >,
  "value"
>;

interface ExternalLinkDetailsItemProps<
  TLabelProps,
> extends ReducedItemProps<TLabelProps> {
  value: string | undefined;
  href: (value: string) => string;
}

export function ExternalLinkDetailsItem<TLabelProps extends TypographyProps>(
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
  openInNewTab,
  ...props
}: TypographyProps & {
  href: (value: string) => string;
  openInNewTab?: boolean;
}) {
  return (
    <DetailsItemValueEmployee {...props}>
      <ExternalLink
        href={isString(children) ? href(children) : undefined}
        openInNewTab={openInNewTab}
        sx={{ wordBreak: "break-word", hyphens: "manual" }}
      >
        {children}
      </ExternalLink>
    </DetailsItemValueEmployee>
  );
}
