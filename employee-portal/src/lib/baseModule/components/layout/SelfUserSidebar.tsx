/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature } from "@eshg/employee-portal-api/base";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import DevicesIcon from "@mui/icons-material/Devices";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Button, Divider, Stack } from "@mui/joy";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import { UserSidebarHeader } from "@/lib/baseModule/components/users/userSidebar/UserSidebarHeader";
import { routes } from "@/lib/baseModule/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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

export function SelfUserSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isActiveSessionsEnabled = useIsNewFeatureEnabled(
    ApiBaseFeature.AccountActiveSessions,
  );
  const isLoginProtocolEnabled = useIsNewFeatureEnabled(
    ApiBaseFeature.LoginProtocol,
  );
  const { data: selfUser } = useGetSelfUser();
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <Sidebar open={open} onClose={onClose} zIndex={"headerSidebar"}>
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

            {isActiveSessionsEnabled && (
              <NavLinkButton
                decorator={<DevicesIcon />}
                href={routes.account.sessions}
              >
                Aktive Sitzungen
              </NavLinkButton>
            )}

            {isLoginProtocolEnabled && (
              <NavLinkButton
                href={routes.account.loginProtocol}
                decorator={<ManageSearchIcon />}
              >
                Anmeldeprotokoll
              </NavLinkButton>
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
    </Sidebar>
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
