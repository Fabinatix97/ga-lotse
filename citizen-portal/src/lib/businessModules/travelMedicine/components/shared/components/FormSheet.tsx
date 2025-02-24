/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Sheet, Stack, Typography } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

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
  const isMobile = useIsMobile();

  return (
    <Stack gap={isMobile ? 1 : 0}>
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
