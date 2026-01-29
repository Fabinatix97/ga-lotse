/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { Divider, Sheet, Stack, Typography } from "@mui/joy";

import { useHeaderHeights } from "@eshg/lib-employee-portal";
import { InternalLinkIconButton, useAutoTitleFocus } from "@eshg/lib-portal";

export function SubPageHeader({
  routeBack,
  header,
}: Readonly<{ routeBack: string; header: string }>) {
  const { headerHeightMobile } = useHeaderHeights();
  const iconSize = headerHeightMobile;
  const titleRef = useAutoTitleFocus();

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
