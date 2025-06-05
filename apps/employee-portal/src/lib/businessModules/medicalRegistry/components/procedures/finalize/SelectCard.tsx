/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { SelectableCard } from "@eshg/lib-employee-portal";

interface SelectCardProps {
  title: string;
  texts?: string[];
  value: unknown;
}

export function SelectCard({ title, texts, value }: SelectCardProps) {
  return (
    <SelectableCard value={value} sx={{ mb: 2 }}>
      <Stack gap={1} sx={{ flexGrow: 1 }}>
        <Typography fontWeight="bold">{title}</Typography>
        {texts?.map((text) => (
          <Typography key={text} level="body-sm">
            {text}
          </Typography>
        ))}
      </Stack>
    </SelectableCard>
  );
}
