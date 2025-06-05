/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Box } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
// eslint-disable-next-line no-restricted-imports
import NextLink from "next/link";
import { ReactNode } from "react";

import { useNavigation } from "./NavigationContext";

export function NavigationLink(
  props: Omit<Parameters<typeof NextLink>[0], "style"> & { sx?: SxProps },
): ReactNode {
  const { tryNavigate } = useNavigation();
  return (
    <Box
      component={NextLink}
      {...props}
      // Since we only use client-side requests, there is only a small performance advantage for the user when prefetching server components.
      // By deactivating this, we reduce the load on the Next.js backend and the reverse proxy.
      prefetch={false}
      onClick={(e) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        tryNavigate(props.href.toString());
      }}
    />
  );
}
