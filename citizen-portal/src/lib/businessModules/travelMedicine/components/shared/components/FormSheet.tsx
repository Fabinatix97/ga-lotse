/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Sheet, Stack, Typography } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";

interface FormSheetProps extends RequiresChildren {
  "data-testid"?: string;
}

export function FormSheet(props: FormSheetProps) {
  return (
    <Sheet
      component="section"
      sx={{
        [theme.breakpoints.down("sm")]: {
          borderRadius: 0,
        },
      }}
      data-testid={props["data-testid"] ?? "form-sheet"}
    >
      <Stack gap={3}>{props.children}</Stack>
    </Sheet>
  );
}

interface FormSheetTitleProps extends RequiresChildren {
  requiredTitle?: string;
}

export function FormSheetTitle(props: FormSheetTitleProps) {
  return (
    <Stack>
      <Typography level="h2">{props.children}</Typography>
      {props.requiredTitle && (
        <Typography
          level="body-xs"
          fontWeight={400}
          sx={{ textAlign: "right" }}
        >
          {props.requiredTitle}
        </Typography>
      )}
    </Stack>
  );
}
