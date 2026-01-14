/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function StepSubTitle({ title }: { title: string }) {
  const { t } = useTranslation("stiProtection/forms");

  return (
    <Stack sx={{ mb: 4 }}>
      <Typography level="h2">{title}</Typography>
      <Typography sx={{ alignSelf: "end" }}>
        {t("common.required_title")}
      </Typography>
    </Stack>
  );
}
