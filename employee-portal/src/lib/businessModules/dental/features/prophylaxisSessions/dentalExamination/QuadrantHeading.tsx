/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack, Typography } from "@mui/joy";
import { Property } from "csstype";

import { theme } from "@/lib/baseModule/theme/theme";

interface QuadrantHeadingRowProps extends RequiresChildren {
  marginTop?: Property.MarginTop;
  marginBottom?: Property.MarginBottom;
}

export function QuadrantHeadingRow(props: QuadrantHeadingRowProps) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
      }}
    >
      {props.children}
    </Stack>
  );
}

export function QuadrantHeading(props: {
  name: string;
  index: number;
  id?: string;
}) {
  return (
    <Typography component="h3" id={props.id}>
      <Typography
        component="span"
        sx={{
          fontSize: theme.fontSize.md,
          fontWeight: theme.fontWeight.lg,
        }}
      >
        {props.name}
      </Typography>{" "}
      - Quadrant {props.index}
    </Typography>
  );
}
