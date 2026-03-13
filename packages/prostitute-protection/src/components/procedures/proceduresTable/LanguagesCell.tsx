/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

import { LANGUAGE_VALUE } from "../../../shared/constants";

export function LanguagesCell({
  languages,
}: {
  languages?: ApiPersonLanguage[];
}) {
  if (!languages || languages.length === 0) return null;

  const sorted = [...languages].sort((a, b) =>
    a === ApiPersonLanguage.German
      ? -1
      : b === ApiPersonLanguage.German
        ? 1
        : 0,
  );

  return (
    <Typography noWrap>
      {sorted.map((value) => LANGUAGE_VALUE[value]).join(", ")}
    </Typography>
  );
}
