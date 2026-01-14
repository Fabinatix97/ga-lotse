/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { RequiresChildren } from "@eshg/lib-portal";

import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

interface FormSheetProps extends RequiresChildren {
  "data-testid"?: string;
}

export function FormSheet(props: FormSheetProps) {
  return (
    <ContentSheet data-testid={props["data-testid"] ?? "form-sheet"}>
      {props.children}
    </ContentSheet>
  );
}

interface FormSheetTitleProps extends RequiresChildren {
  requiredTitle?: string;
  sx?: SxProps;
}

export function FormSheetTitle(props: FormSheetTitleProps) {
  return (
    <Stack gap={byBreakpoint({ mobile: 1, desktop: 0 })} sx={props.sx}>
      <ContentSheetTitle>{props.children}</ContentSheetTitle>
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
