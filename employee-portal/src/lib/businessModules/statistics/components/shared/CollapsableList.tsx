/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { Stack, Typography } from "@mui/joy";
import { useState } from "react";

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
    <Stack>
      {resultItems.map((it) => (
        <Typography level="body-md" key={it}>
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
  );
}
