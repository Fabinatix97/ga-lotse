/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { UserType } from "@/lib/baseModule/components/layout/types";
import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  LanguagePicker,
  LanguagePickerReduced,
} from "@/lib/i18n/components/LanguagePicker";
import { byBreakpoint } from "@/lib/shared/breakpoints";

import { PageSwitchButton, PageSwitchButtons } from "./PageSwitchButtons";

export function MainMenu({ userType }: Readonly<{ userType: UserType }>) {
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      flex={1}
      paddingBlock={1}
    >
      <PageSwitchButtons userType={userType} />
      <Stack flexDirection="row" width="132px" justifyContent="end">
        <LanguagePicker />
      </Stack>
    </Stack>
  );
}

export function MainMenuReduced({
  userType,
}: Readonly<{ userType: UserType }>) {
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      flex={1}
      paddingBlock={1}
    >
      <UserTypeButton userType={userType} />
      <Stack flexDirection="row">
        <LanguagePickerReduced
          slotProps={{
            menuButton: {
              root: {
                sx: {
                  flexDirection: byBreakpoint({
                    mobile: "column",
                    desktop: "row",
                  }),
                  color: (theme) => theme.palette.text.primary,
                  "--Button-gap": byBreakpoint({
                    mobile: "0px",
                    desktop: "8px",
                  }),
                },
              },
            },
          }}
        />
      </Stack>
    </Stack>
  );
}

function UserTypeButton({ userType }: Readonly<{ userType: UserType }>) {
  const { t } = useTranslation("base/header");
  const routes = useRoutes();

  return userType === "person" ? (
    <PageSwitchButton
      name={t("main_menu.person_link")}
      href={routes.citizenPath.index + "/"}
      isActive={userType === "person"}
      sx={{
        display: byBreakpoint({ mobile: "none", desktop: "flex" }),
      }}
    />
  ) : (
    <PageSwitchButton
      name={t("main_menu.org_link")}
      href={routes.organizationPath.index}
      isActive={userType === "organization"}
      sx={{
        display: byBreakpoint({ mobile: "none", desktop: "flex" }),
      }}
    />
  );
}
