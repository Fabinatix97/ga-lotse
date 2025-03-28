/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export interface TranslatedListProps {
  baseKey: string;
  headingKey: string;
  listKey: string;
  length: number;
  localePath: string;
}

export function TranslatedList({
  baseKey,
  headingKey,
  listKey,
  length,
  localePath,
}: TranslatedListProps) {
  const { t } = useTranslation(localePath);
  return (
    <div>
      <Typography level="title-md">{t(`${baseKey}.${headingKey}`)}</Typography>
      <Box component="ul" sx={{ margin: 1, paddingLeft: 2 }}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <Typography
              key={index}
              component="li"
              sx={{ display: "list-item" }}
            >
              {t(`${baseKey}.${listKey}.${index}`)}
            </Typography>
          ))}
      </Box>
    </div>
  );
}
