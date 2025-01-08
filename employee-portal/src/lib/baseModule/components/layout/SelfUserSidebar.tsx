/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import DevicesIcon from "@mui/icons-material/Devices";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Button, Divider, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import { ChatSettingsButton } from "@/lib/baseModule/components/layout/ChatSettingsSidebar";
import { UserSidebarHeader } from "@/lib/baseModule/components/users/userSidebar/UserSidebarHeader";
import { routes } from "@/lib/baseModule/shared/routes";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function useSelfUserSidebar(): UseSidebarResult {
  return useSidebar({
    component: SelfUserSidebar,
  });
}

function NavLinkButton({
  href,
  decorator,
  children,
}: {
  href: string;
  decorator: ReactNode;
  children: string;
}) {
  return (
    <InternalLinkButton
      variant={"plain"}
      size={"md"}
      startDecorator={decorator}
      href={href}
      sx={{
        paddingInline: 1,
        justifyContent: "flex-start",
      }}
    >
      {children}
    </InternalLinkButton>
  );
}

function MiscLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <InternalLink
      href={href}
      sx={{
        textDecoration: "none",
      }}
    >
      {label}
    </InternalLink>
  );
}

function SelfUserSidebar() {
  const { data: selfUser } = useGetSelfUser();
  const {
    canAccessChat,
    userSettings: { chatUsageEnabled, accountDeactivated },
  } = useChat();

  return (
    <>
      <SidebarContent header={<UserSidebarHeader selfUser={selfUser} />}>
        <Stack gap={3} height="100%">
          <Stack gap={2} flex={1}>
            <Divider orientation="horizontal" />

            <NavLinkButton
              decorator={<ProfileIcon />}
              href={routes.users.details(selfUser.userId)}
            >
              Profil
            </NavLinkButton>
            <NavLinkButton
              decorator={<DevicesIcon />}
              href={routes.account.sessions}
            >
              Aktive Sitzungen
            </NavLinkButton>
            <NavLinkButton
              href={routes.account.loginProtocol}
              decorator={<ManageSearchIcon />}
            >
              Anmeldeprotokoll
            </NavLinkButton>

            {canAccessChat && chatUsageEnabled && !accountDeactivated && (
              <ChatSettingsButton />
            )}

            <Divider orientation="horizontal" />
          </Stack>

          <Stack gap={2}>
            <MiscLinkButton
              href={routes.accessibility}
              label="Erklärung zur Barrierefreiheit"
            />
            <MiscLinkButton
              href={routes.privacy}
              label="Datenschutzerklärung"
            />
            <MiscLinkButton
              href={routes.usageNotes}
              label={"Nutzungshinweise"}
            />
            <MiscLinkButton href={routes.acknowledgements} label="Danksagung" />
            <MiscLinkButton href={routes.contact} label="Kontakt" />
            <MiscLinkButton href={routes.releaseNotes} label="Release Notes" />
          </Stack>
        </Stack>
      </SidebarContent>

      <SidebarActions>
        <ButtonBar right={<LogoutButton />} />
      </SidebarActions>
    </>
  );
}

function LogoutButton() {
  return (
    <Button
      component="a"
      href="/logout/keycloak"
      variant="solid"
      color="danger"
      sx={{
        alignSelf: "end",
      }}
      endDecorator={<LogoutIcon />}
    >
      Abmelden
    </Button>
  );
}
