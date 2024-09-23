/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Sheet, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

import { theme } from "@/lib/baseModule/theme/theme";

export function Page(props: RequiresChildren) {
  return <Stack gap={3}>{props.children}</Stack>;
}

interface PageTitleProps extends RequiresChildren {
  toolbar?: ReactNode;
}

export function PageTitle(props: PageTitleProps) {
  return (
    <Sheet
      component={Stack}
      direction="row"
      gap={3}
      alignItems="center"
      sx={{
        [theme.breakpoints.down("sm")]: {
          borderRadius: 0,
        },
      }}
    >
      <Typography
        level="h2"
        flexGrow={1}
        sx={{ hyphens: "auto", overflowWrap: "break-word" }}
      >
        {props.children}
      </Typography>
      {props.toolbar}
    </Sheet>
  );
}
