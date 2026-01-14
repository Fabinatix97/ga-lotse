/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function EmptyCell() {
  const { t } = useTranslation();
  return <Typography fontStyle="italic">{t("columnHeader.empty")}</Typography>;
}
