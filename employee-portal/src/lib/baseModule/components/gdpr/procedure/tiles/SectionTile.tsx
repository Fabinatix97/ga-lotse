/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, SheetProps, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";

export function SectionTile({
  id,
  ...sheetProps
}: SheetProps & { id: string }) {
  return (
    <Sheet
      component={"section"}
      aria-labelledby={id}
      sx={{
        display: "grid",
        gap: 2,
        padding: 3,
      }}
      {...sheetProps}
    />
  );
}

export function SectionTitle(props: PropsWithChildren<{ id: string }>) {
  return (
    <Typography component={"h2"} level={"h3"} id={props.id}>
      {props.children}
    </Typography>
  );
}
