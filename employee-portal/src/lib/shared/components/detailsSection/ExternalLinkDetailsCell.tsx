/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

import { ExternalLink } from "@eshg/lib-portal";

import {
  DetailsCell,
  DetailsCellProps,
} from "@/lib/shared/components/detailsSection/DetailsCell";

export function ExternalLinkDetailsCell(
  props: DetailsCellProps & {
    value: string | undefined;
    href: (value: string) => string;
  },
) {
  return (
    <DetailsCell
      {...props}
      value={
        isDefined(props.value) ? (
          <ExternalLink
            href={props.href(props.value)}
            sx={{ wordBreak: "break-word", hyphens: "manual" }}
          >
            {props.value}
          </ExternalLink>
        ) : undefined
      }
    />
  );
}

export function phoneHref(phoneNumber: string) {
  return `tel:${phoneNumber}`;
}

export function emailHref(email: string) {
  return `mailto:${email}`;
}
