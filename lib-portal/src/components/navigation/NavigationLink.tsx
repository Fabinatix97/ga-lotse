/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

// eslint-disable-next-line no-restricted-imports
import NextLink from "next/link";
import { ReactNode, Ref, forwardRef } from "react";

import { useNavigation } from "./NavigationContext";

function Navlink(
  props: Parameters<typeof NextLink>[0],
  ref: Ref<HTMLAnchorElement>,
): ReactNode {
  const { tryNavigate } = useNavigation();
  return (
    <NextLink
      {...props}
      // Since we only use client-side requests, there is only a small performance advantage for the user when prefetching server components.
      // By deactivating this, we reduce the load on the Next.js backend and the reverse proxy.
      prefetch={false}
      onClick={(e) => {
        e.preventDefault();
        tryNavigate(props.href as string);
      }}
      ref={ref}
    />
  );
}

export const NavigationLink = forwardRef(Navlink);
