/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, Typography, TypographyProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";

interface ResponsiveTypographyProps extends TypographyProps {
  linesToShow?: number;
  sx?: SxProps;
  value: string;
}
export function ResponsiveTypography({
  linesToShow = 1,
  sx,
  value,
  ...typographyProps
}: ResponsiveTypographyProps) {
  return (
    <Typography
      sx={
        {
          ...multiLineEllipsis(linesToShow),
          ...sx,
        } as SxProps
      }
      slotProps={{
        root: {
          title: value,
        },
      }}
      {...typographyProps}
    >
      {value}
    </Typography>
  );
}

export function DataField({ label, value }: { label: string; value: string }) {
  return (
    <Grid container xxs={12}>
      <Grid xxs={12} sm={3}>
        <ResponsiveTypography level="body-md" sx={{ mr: 2 }} value={label} />
      </Grid>
      <Grid xxs={12} sm={9}>
        <ResponsiveTypography level="title-md" fontWeight="600" value={value} />
      </Grid>
    </Grid>
  );
}
