/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

export function HistoryChange({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <>
      <Typography fontWeight="md" level="body-sm">
        {label}
      </Typography>
      {value ? (
        <Typography fontWeight="lg" level="body-md">
          {value}
        </Typography>
      ) : (
        <Typography color="neutral" level="body-md" component="i">
          - Keine Angaben -
        </Typography>
      )}
    </>
  );
}
