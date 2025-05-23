/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, StackProps } from "@mui/joy";

import { ContentPanel } from "@eshg/lib-employee-portal";
import { ExternalLink } from "@eshg/lib-portal";

export function LinkInNewTab({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <ExternalLink href={href} target="_blank">
      {children}
    </ExternalLink>
  );
}

export function StaticTextDocumentPanel(props: StackProps) {
  return (
    <ContentPanel>
      <Stack
        gap={2}
        sx={{
          "& :not(:where(h1, h2, h3))": {
            margin: 0,
          },
          "& :where(p, span, li)": {
            maxWidth: "750px",
            textWrap: "pretty",
            hyphens: "auto",
          },
          "& :where(h1, h2, h3)": {
            maxWidth: "750px",
            textWrap: "balance",
            hyphens: "auto",
          },
          "& a": {
            maxWidth: "fit-content",
            textWrap: "nowrap",
            hyphens: "none",
          },
        }}
        {...props}
      />
    </ContentPanel>
  );
}
