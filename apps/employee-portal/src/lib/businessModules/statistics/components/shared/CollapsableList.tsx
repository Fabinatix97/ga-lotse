/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { useState } from "react";

import { ButtonLink } from "@eshg/lib-portal";

export function CollapsableList({
  items,
  shownItemsWhileCollapsed = 3,
}: {
  items: string[];
  shownItemsWhileCollapsed?: number;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const resultItems = collapsed
    ? items.slice(0, shownItemsWhileCollapsed)
    : items;

  return (
    <>
      {items.map((it) => (
        <Typography key={it} sx={visuallyHidden} role="definition">
          {it}
        </Typography>
      ))}
      <Stack aria-hidden="true">
        {resultItems.map((it) => (
          <Typography key={it} level="body-md">
            {it}
          </Typography>
        ))}
        {shownItemsWhileCollapsed < items.length && (
          <ButtonLink
            sx={{ alignSelf: "flex-start" }}
            variant="plain"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "Alle anzeigen" : "Weniger anzeigen"}
          </ButtonLink>
        )}
      </Stack>
    </>
  );
}
