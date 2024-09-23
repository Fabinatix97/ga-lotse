/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PersonOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

import { VerticalAlignedButton } from "./VerticalAlignedButton";

export function LoginButton() {
  const { t } = useTranslation("base/header");

  return (
    <Button
      variant="plain"
      sx={{ color: (theme) => theme.palette.text.primary, height: "40px" }}
      startDecorator={<PersonOutlined />}
    >
      {t("login_link")}
    </Button>
  );
}

export function LoginButtonMobile() {
  const { t } = useTranslation("base/header");

  return (
    <VerticalAlignedButton>
      <PersonOutlined />
      {t("login_link")}
    </VerticalAlignedButton>
  );
}
