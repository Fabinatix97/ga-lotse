/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function ContentHeader({ title }: Readonly<{ title: string }>) {
  const { t } = useTranslation();
  return (
    <Typography
      level="h2"
      sx={{
        paddingTop: { xxs: 0.5, md: 1.5 },
        paddingBottom: { xxs: 2.5, md: 4 },
      }}
    >
      {t(title)}
    </Typography>
  );
}
