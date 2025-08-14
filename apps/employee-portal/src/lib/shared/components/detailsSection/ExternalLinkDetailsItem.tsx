/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

import { DetailsItem } from "@eshg/lib-employee-portal";
import { ExternalLink } from "@eshg/lib-portal";

export function ExternalLinkDetailsItem(props: {
  label: string;
  value: string | undefined;
  href: (value: string) => string;
}) {
  return (
    <DetailsItem
      label={props.label}
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
