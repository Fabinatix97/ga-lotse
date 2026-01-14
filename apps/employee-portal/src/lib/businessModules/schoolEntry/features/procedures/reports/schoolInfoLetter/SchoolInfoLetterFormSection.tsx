/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SwitchAccessShortcutAddOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";
import { isDefined } from "remeda";

import { isNonEmptyString } from "@eshg/lib-portal";

export function SchoolInfoLetterFormSection({
  subtitle,
  isChanged,
  differentValues,
  type,
  children,
}: PropsWithChildren<{
  subtitle?: string;
  isChanged: boolean;
  differentValues: string;
  type?: "radio" | "checkboxGroup" | "text" | "date";
}>) {
  return (
    <Stack
      data-testid="letter-section"
      gap={3}
      sx={(theme) =>
        isChanged
          ? {
              marginLeft: `calc(-1 * ${theme.spacing(3)} - 4px)`,
              paddingLeft: theme.spacing(3),
              borderLeft: `4px ${theme.palette.primary.solidBg} solid`,
              position: "relative",
            }
          : {}
      }
    >
      {isChanged && (
        <Stack
          data-testid="letter-section-isChanged"
          alignItems="center"
          position="absolute"
          top="50%"
          left={(theme) => theme.spacing(-4.5)}
          sx={{ transform: "translate(-100%, -50%)" }}
        >
          <SwitchAccessShortcutAddOutlined color="primary" />
          <Typography color="primary" level="body-md">
            geändert
          </Typography>
        </Stack>
      )}
      {isDefined(subtitle) && (
        <Typography data-testid="letter-section-subtitle" level="title-md">
          {subtitle}
        </Typography>
      )}
      <Stack gap={1}>
        {isChanged && isNonEmptyString(differentValues) && (
          <Typography
            data-testid="letter-section-initial-value"
            color="primary"
            level="body-md"
          >
            Initiale Auswahl:{" "}
            <Typography color="primary" level="title-md">
              {differentValues}
            </Typography>
          </Typography>
        )}
        <Stack data-testid={`letter-section-field-${type ?? ""}`} gap={3}>
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
}
