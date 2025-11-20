/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

import { LANGUAGE_VALUE } from "../../../shared/constants";

export function LanguagesCell({
  languages,
}: {
  languages?: ApiPersonLanguage[];
}) {
  const [isOpen, setOpen] = useState(false);

  if (!languages || languages.length === 0) return null;

  const sorted = [...languages].sort((a, b) =>
    a === ApiPersonLanguage.German
      ? -1
      : b === ApiPersonLanguage.German
        ? 1
        : 0,
  );

  const showToggle = sorted.length > 1;

  if (!isOpen && showToggle) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography noWrap fontSize="sm">
          {LANGUAGE_VALUE[sorted[0]!]}
        </Typography>

        <IconButton
          size="sm"
          variant="plain"
          sx={{ padding: 0 }}
          onClick={() => setOpen(true)}
        >
          <KeyboardArrowDown size="sm" />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={0.25}
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Stack sx={{ maxWidth: "80%" }}>
        {sorted.map((type) => (
          <Typography key={type} fontSize="sm" noWrap>
            {LANGUAGE_VALUE[type]}
          </Typography>
        ))}
      </Stack>
      {showToggle && (
        <IconButton
          size="sm"
          variant="plain"
          sx={{ padding: 0 }}
          onClick={() => setOpen(false)}
        >
          <KeyboardArrowUp size="sm" />
        </IconButton>
      )}
    </Stack>
  );
}
