/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import JoyLink from "@mui/joy/Link";
// eslint-disable-next-line no-restricted-imports
import NextLink from "next/link";
import { PropsWithChildren, forwardRef } from "react";
import { isNonNullish, omit } from "remeda";

export const EntityLink = forwardRef(
  (
    props: PropsWithChildren<{
      linkTo: string | undefined;
      name?: string;
      value: string;
    }>,
    ref,
  ) => {
    if (!props.linkTo) {
      return props.children;
    }
    const href = `/${props.linkTo}?${props.name ?? "id"}=${props.value}`;
    return (
      isNonNullish(props.children) &&
      props.children !== "" && (
        <JoyLink
          // @ts-expect-error Joy-UI's Link type declaration is missing ref
          ref={ref}
          {...omit(props, ["linkTo", "name", "value"])}
          component={NextLink}
          href={href}
          sx={{ textAlignLast: "justify", display: "inline" }}
          onClick={(event) => event.stopPropagation()}
        >
          {props.children}
        </JoyLink>
      )
    );
  },
);
EntityLink.displayName = "EntityLink";
