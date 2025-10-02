/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Card as JoyCard, Stack, Theme, Typography } from "@mui/joy";
import { ReactNode } from "react";

type metricsCardColors =
  | "background"
  | "warning"
  | "primary"
  | "danger"
  | "success";

const BACKGROUND_COLORS = {
  background: "background.body",
  warning: "warning.100",
  primary: "primary.100",
  danger: "danger.100",
  success: "success.100",
};

function borderColors(color: metricsCardColors) {
  return (theme: Theme) => {
    if (color === "background") {
      return theme.palette.divider;
    }
    return theme.palette[color].outlinedBorder;
  };
}

export function FlashCard({
  color,
  title,
  figure,
  icon,
}: {
  color: metricsCardColors;
  title: string;
  figure: string;
  icon: ReactNode;
}) {
  return (
    <JoyCard
      variant="soft"
      size="md"
      sx={{
        flex: 1,
        backgroundColor: BACKGROUND_COLORS[color],
        border: "1px solid",
        borderColor: borderColors(color),
      }}
      data-testid="metrics-card"
    >
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between" paddingBottom={1}>
          <Typography
            level="title-md"
            sx={{ color: "warning.700" }}
            role="term"
          >
            {title}
          </Typography>
          <Box
            width="8px"
            height="8px"
            flexShrink="0"
            bgcolor="white"
            borderRadius={8}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {icon}
          <Typography
            component="p"
            level="h4"
            sx={{ color: "warning.700" }}
            role="definition"
          >
            {figure}
          </Typography>
        </Stack>
      </Stack>
    </JoyCard>
  );
}
