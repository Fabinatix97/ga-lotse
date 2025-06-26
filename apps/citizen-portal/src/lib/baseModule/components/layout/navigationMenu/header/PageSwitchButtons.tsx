/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, ToggleButtonGroup } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { UserType } from "@/lib/baseModule/components/layout/types";
import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ScopedNavigationLink } from "@/lib/shared/components/scopedLinks";

export function PageSwitchButtons({ userType }: { userType: UserType }) {
  const { t } = useTranslation("base/header");
  const routes = useRoutes();

  return (
    <Stack flexDirection="row">
      <PageSwitchButton
        name={t("main_menu.person_link")}
        href={routes.citizenPath.index + "/"}
        isActive={userType === "person"}
      />
      <PageSwitchButton
        name={t("main_menu.org_link")}
        href={routes.organizationPath.index}
        isActive={userType === "organization"}
      />
    </Stack>
  );
}

export function PageSwitchButtonsMobile({ userType }: { userType: UserType }) {
  const { t } = useTranslation("base/header");
  const routes = useRoutes();

  return (
    <ToggleButtonGroup color="primary">
      <Button
        variant={userType === "person" ? "solid" : "soft"}
        color={userType === "person" ? "primary" : "neutral"}
        component={ScopedNavigationLink}
        href={routes.citizenPath.index + "/"}
        sx={(theme) => ({
          flex: 1,
          height: "40px",
          "--variant-softColor": theme.palette.primary.solidBg,
          fontSize: "1rem",
        })}
      >
        {t("main_menu.person_link")}
      </Button>
      <Button
        variant={userType === "organization" ? "solid" : "soft"}
        color={userType === "organization" ? "primary" : "neutral"}
        component={ScopedNavigationLink}
        href={routes.organizationPath.index}
        sx={(theme) => ({
          flex: 1,
          height: "40px",
          "--variant-softColor": theme.palette.primary.solidBg,
          fontSize: "1rem",
        })}
      >
        {t("main_menu.org_link")}
      </Button>
    </ToggleButtonGroup>
  );
}

export function PageSwitchButton({
  name,
  href,
  isActive,
  sx,
}: {
  name: string;
  href: string;
  isActive: boolean;
  sx?: SxProps;
}) {
  return (
    <Button
      variant="plain"
      size="md"
      sx={{
        fontWeight: isActive ? "700" : "400",
        fontSize: "1rem",
        color: (theme) =>
          isActive ? theme.palette.primary : theme.palette.text.primary,
        ...sx,
      }}
      component={ScopedNavigationLink}
      href={href}
    >
      {name}
    </Button>
  );
}
