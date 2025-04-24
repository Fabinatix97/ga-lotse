/**
 * Copyright 2025 cronn GmbH
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
import { createContext, useContext, useId } from "react";

import { theme } from "@/lib/baseModule/theme/theme";
import { MobileBreakpoint } from "@/lib/shared/breakpoints";

interface ContentSheetProps extends Pick<SheetProps, "sx">, RequiresChildren {
  "data-testid"?: string;
  missingTitle?: boolean;
}

const SectionTitleId = createContext<string | undefined>(undefined);

export function ContentSheet(props: ContentSheetProps) {
  const titleId = useId();
  return (
    <Sheet
      component={props.missingTitle ? "div" : "section"}
      sx={{
        [theme.breakpoints.down(MobileBreakpoint.Down)]: {
          borderRadius: 0,
        },
        ...props.sx,
      }}
      data-testid={props["data-testid"]}
      aria-labelledby={props.missingTitle ? undefined : titleId}
    >
      <SectionTitleId value={titleId}>
        <Stack gap={3}>{props.children}</Stack>
      </SectionTitleId>
    </Sheet>
  );
}

interface ContentSheetTitleProps
  extends Pick<TypographyProps, "sx">,
    RequiresChildren {
  "data-testid"?: string;
}

export function ContentSheetTitle(props: ContentSheetTitleProps) {
  const titleId = useContext(SectionTitleId);
  return (
    <Typography
      level="h2"
      sx={props.sx}
      data-testid={props["data-testid"]}
      id={titleId}
    >
      {props.children}
    </Typography>
  );
}
