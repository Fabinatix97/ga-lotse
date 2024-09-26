/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { Stack, StackProps, Typography } from "@mui/joy";

import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";

export function NoWrap({ children }: { children: string }) {
  return (
    <Typography component={"span"} noWrap sx={{ display: "inline" }}>
      {children}
    </Typography>
  );
}

export function LinkInNewTab({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <ExternalLink href={href} target={"_blank"}>
      {children}
    </ExternalLink>
  );
}

export function StaticTextDocumentPanel(props: StackProps) {
  return (
    <ContentPanel>
      <Stack
        gap={4}
        sx={{
          "& :where(p, span)": {
            maxWidth: "750px",
            textWrap: "pretty",
            hyphens: "auto",
          },
          "& :where(h2, h3)": {
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
