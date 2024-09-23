/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import {
  Sheet,
  SheetProps,
  Stack,
  Typography,
  TypographyProps,
} from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";

interface ContentSheetProps extends Pick<SheetProps, "sx">, RequiresChildren {}

export function ContentSheet(props: ContentSheetProps) {
  return (
    <Sheet
      component="section"
      sx={{
        [theme.breakpoints.down("sm")]: {
          borderRadius: 0,
        },
        ...props.sx,
      }}
    >
      <Stack gap={3}>{props.children}</Stack>
    </Sheet>
  );
}

interface ContentSheetTitleProps
  extends Pick<TypographyProps, "component" | "sx">,
    RequiresChildren {}

export function ContentSheetTitle(props: ContentSheetTitleProps) {
  return (
    <Typography level="h3" component={props.component ?? "h3"} sx={props.sx}>
      {props.children}
    </Typography>
  );
}
