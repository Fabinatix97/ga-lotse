/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Box } from "@mui/joy";
// eslint-disable-next-line no-restricted-imports
import NextLink from "next/link";
import { ReactNode, useEffect } from "react";

import { useFocus } from "../../hooks/useFocus";

import { useNavigation } from "./NavigationContext";

export function NavigationLink(
  props: Parameters<typeof NextLink>[0],
): ReactNode {
  const { tryNavigate } = useNavigation();

  /*
   This look incredibly weird. The reason I do it like this is twofold.
   1. The passed through autoFocus on the generated a Element, does not seem to work.
   2. NextLink by itself does not provide a ref element to the link that is generated.
      To get a ref, one normally passes a child, which we do from outside.
      But its hard to get a ref for it, so we just get it via an invisible parent.
   */
  const { ref, focus } = useFocus();
  useEffect(() => {
    if (props.autoFocus) {
      focus();
    }
  }, [focus, props.autoFocus]);

  if (!props.autoFocus) {
    /*
    Having the box around the NextLink without autoFocus caused focus issues,
    which I could not resolve any other way.
     */
    return (
      <NextLink
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

  return (
    <Box
      ref={(el: HTMLElement) => {
        ref.current = el?.children?.item(0) as HTMLElement | null;
      }}
      display="contents"
    >
      <NextLink
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
    </Box>
  );
}
