/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";

export function SyncFormField({
  label,
  value,
  altLabel,
  visible,
}: {
  label: string;
  value: string | undefined;
  altLabel?: string;
  visible: boolean;
}) {
  return (
    visible && (
      <Stack gap={0.25}>
        <Typography
          level="body-sm"
          textColor="text.secondary"
          sx={{ minWidth: "fit-content" }}
          aria-label={altLabel}
        >
          {label}
        </Typography>
        {value?.length ? (
          <Typography level="title-md">{value}</Typography>
        ) : (
          <Typography
            level="title-md"
            whiteSpace="preserve"
            aria-label="Keine Angaben"
            sx={{ userSelect: "none", minWidth: "fit-content", opacity: 0 }}
          />
        )}
      </Stack>
    )
  );
}
