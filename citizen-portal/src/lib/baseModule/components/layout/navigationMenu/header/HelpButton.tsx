/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HelpOutlineOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function HelpButton() {
  const { t } = useTranslation("base/header");

  return (
    <Button
      variant="plain"
      sx={{
        color: (theme) => theme.palette.text.primary,
        width: { xxs: "100%", md: "auto" },
        justifyContent: "flex-start",
        height: "40px",
      }}
      startDecorator={<HelpOutlineOutlined />}
    >
      {t("help_link")}
    </Button>
  );
}
