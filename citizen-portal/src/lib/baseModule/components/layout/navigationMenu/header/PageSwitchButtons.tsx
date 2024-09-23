/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Button, Stack, ToggleButtonGroup } from "@mui/joy";

import { UserType } from "@/lib/baseModule/components/layout/types";
import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

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
        component={NavigationLink}
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
        component={NavigationLink}
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

function PageSwitchButton({
  name,
  href,
  isActive,
}: {
  name: string;
  href: string;
  isActive: boolean;
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
      }}
      component={NavigationLink}
      href={href}
    >
      {name}
    </Button>
  );
}
