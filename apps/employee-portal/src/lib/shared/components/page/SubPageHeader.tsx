/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { useEffect, useRef } from "react";

import { useHeaderHeights } from "@eshg/lib-employee-portal";
import { InternalLinkIconButton } from "@eshg/lib-portal";

export function SubPageHeader({
  routeBack,
  header,
}: Readonly<{ routeBack: string; header: string }>) {
  const { headerHeightMobile } = useHeaderHeights();
  const iconSize = headerHeightMobile;
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the title when the page is loaded
    titleRef.current?.focus();
  }, []);

  return (
    <Sheet sx={{ padding: 0, borderRadius: 0 }} data-testid="subPageHeader">
      <Stack direction="row" divider={<Divider orientation="vertical" />}>
        <InternalLinkIconButton
          href={routeBack}
          aria-label="Zurück zur Übersicht"
          sx={{ width: iconSize, height: iconSize }}
        >
          <ChevronLeft sx={{ width: "40px", height: "40px" }} />
        </InternalLinkIconButton>
        <Typography
          ref={titleRef}
          level="h2"
          component="h1"
          tabIndex={-1}
          sx={{ paddingInline: 3, alignSelf: "center" }}
        >
          {header}
        </Typography>
      </Stack>
    </Sheet>
  );
}
