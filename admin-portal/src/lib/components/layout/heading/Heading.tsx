/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography, styled } from "@mui/joy";

import { EnvironmentIndicator } from "@eshg/lib-portal/components/EnvironmentIndicator";

import { LanguageSwitch } from "@/lib/components/layout/nav/LanguageSwitch";
import {
  appBarHeightDesktop,
  appBarHeightMobile,
} from "@/lib/components/layout/theme/sizes";
import { UserHeading } from "@/lib/components/user/UserHeading";
import { useTranslation } from "@/lib/i18n/client";

const StyledHeader = styled("header")(({ theme }) => ({
  display: "flex",
  background: `linear-gradient(90deg, var(--joy-palette-primary-solidActiveBg) 0%, var(--joy-palette-primary-solidBg) 100%)`,
  boxShadow: "var(--joy-shadow-xl)",
  padding: `0 ${theme.spacing(3)}`,
  "& h1, p": {
    color: "inherit",
  },
  color: "var(--joy-palette-common-white)",
  "--joy-palette-focusVisible": "var(--joy-palette-common-white)",
}));

export function Heading() {
  const { t } = useTranslation();

  return (
    <Stack display="flex" flexDirection="column">
      <EnvironmentIndicator />
      <StyledHeader
        sx={{ height: { xxs: appBarHeightMobile, sm: appBarHeightDesktop } }}
      >
        <Stack flex={1} justifyContent="space-between" alignItems="center">
          <Typography level="h1">{t("gaLotseAdminPortal")}</Typography>
          <Stack alignItems="center" gap={3}>
            <LanguageSwitch />
            <UserHeading />
          </Stack>
        </Stack>
      </StyledHeader>
    </Stack>
  );
}
