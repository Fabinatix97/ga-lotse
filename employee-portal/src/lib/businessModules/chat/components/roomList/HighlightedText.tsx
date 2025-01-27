/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, useTheme } from "@mui/joy";

interface HighlightedTextProps {
  text?: string;
  searchQuery?: string;
}

export function HighlightedText({
  text,
  searchQuery,
}: Readonly<HighlightedTextProps>) {
  const theme = useTheme();

  if (!text) {
    return null;
  }

  if (!searchQuery) {
    return <Box component="span">{text}</Box>;
  }

  const splitRegex = new RegExp(searchQuery, "gi");
  const parts = text.split(splitRegex);
  const match = text.match(splitRegex);

  if (parts.length <= 1 || !match) {
    return <Box component="span">{text}</Box>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <Box component="span" key={`${index}-${part}`}>
          {index > 0 && (
            <Box
              component="mark"
              sx={{ backgroundColor: theme.palette.success[100] }}
            >
              {match[0]}
            </Box>
          )}
          {part}
        </Box>
      ))}
    </>
  );
}
