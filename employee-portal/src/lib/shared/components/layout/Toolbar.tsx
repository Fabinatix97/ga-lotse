/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Row } from "@eshg/lib-portal/components/Row";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { Sheet, Typography } from "@mui/joy";

import { simpleToolbarHeight } from "@/lib/baseModule/components/layout/sizes";

export interface ToolbarProps {
  title: string;
  backHref?: string;
}

export function Toolbar({ title, backHref }: ToolbarProps) {
  return (
    <Row sx={{ gap: 0 }}>
      {backHref && (
        <InternalLinkButton
          aria-label="Zurück"
          href={backHref}
          variant="outlined"
          color="neutral"
          sx={{
            borderRadius: 0,
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
        >
          <ChevronLeft sx={{ width: "2rem", height: "2rem" }} />
        </InternalLinkButton>
      )}
      <Sheet
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 0,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          height: simpleToolbarHeight,
          flex: 1,
        }}
      >
        <Typography
          component="h1"
          level="h2"
          sx={{
            paddingLeft: 1,
          }}
        >
          {title}
        </Typography>
      </Sheet>
    </Row>
  );
}
