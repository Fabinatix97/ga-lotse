/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddOutlined, SearchRounded } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isNonNullish } from "remeda";

export interface NoSearchResultsProps {
  info: string;
  buttonLabel?: string;
  onClick?: () => void;
  decorator?: ReactNode;
}

export function NoSearchResults({
  info,
  buttonLabel,
  onClick,
  decorator,
}: NoSearchResultsProps) {
  return (
    <Stack alignItems="center" gap={3}>
      <Stack alignItems="center" gap={1}>
        <SearchRounded sx={{ width: 40, height: 40 }} />
        <Typography level="body-md">{info}</Typography>
      </Stack>
      {isNonNullish(buttonLabel) && isNonNullish(onClick) && (
        <Button
          variant="outlined"
          startDecorator={decorator ?? <AddOutlined />}
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      )}
    </Stack>
  );
}
