/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Alert, Typography } from "@mui/joy";

interface SummaryItemProps {
  content: string;
  color: "success" | "primary" | "danger";
}

export function SummaryItem(props: SummaryItemProps) {
  return (
    <Alert
      aria-live="polite"
      variant="soft"
      color={props.color}
      sx={{ padding: 1 }}
    >
      <Typography
        fontSize="sm"
        fontWeight="md"
        variant="soft"
        color={props.color}
      >
        {props.content}
      </Typography>
    </Alert>
  );
}
