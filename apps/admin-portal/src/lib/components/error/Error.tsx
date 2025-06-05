/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function Error({ error }: Readonly<{ error: Error }>) {
  const { t } = useTranslation();

  return (
    <Typography color="danger">{`${t("error")}: ${t("errorReason." + error.message)}`}</Typography>
  );
}
