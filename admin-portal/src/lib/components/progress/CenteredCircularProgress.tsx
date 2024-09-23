/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CircularProgress, Stack } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function CenteredCircularProgress() {
  const { t } = useTranslation();
  const progressLabel = t("progress");

  return (
    <Stack justifyContent="center" alignItems="center">
      <CircularProgress
        data-testid="circular-progress"
        aria-label={progressLabel}
      />
    </Stack>
  );
}
