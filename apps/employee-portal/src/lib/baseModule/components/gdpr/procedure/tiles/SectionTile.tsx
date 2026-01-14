/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, SheetProps, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { EditButton } from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal";

export function SectionTile({
  id,
  ...sheetProps
}: SheetProps & { id: string }) {
  return (
    <Sheet
      component="section"
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

interface SectionTitleProps extends RequiresChildren {
  id: string;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function SectionTitle(props: SectionTitleProps) {
  return (
    <Typography
      component="h2"
      level="h3"
      id={props.id}
      endDecorator={
        isDefined(props.onEdit) &&
        props.canEdit && <EditButton onClick={props.onEdit} />
      }
      justifyContent="space-between"
    >
      {props.children}
    </Typography>
  );
}
