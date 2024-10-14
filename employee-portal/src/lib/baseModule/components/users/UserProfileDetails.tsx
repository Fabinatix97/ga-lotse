/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiBaseFeature,
  ApiUser,
  ApiUserGroup,
} from "@eshg/employee-portal-api/base";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { isNullish } from "remeda";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { GroupList } from "@/lib/baseModule/components/users/GroupList";
import { UserProfileEditSidebar } from "@/lib/baseModule/components/users/UserProfileEditSidebar";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import {
  ExternalLinkDetailsCell,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

import { UserAvatar } from "./UserAvatar";

export function UserProfileDetails({
  user,
  groups,
  isSelf,
}: {
  user: ApiUser;
  groups: ApiUserGroup[];
  isSelf: boolean;
}) {
  const showChatUsername = useIsNewFeatureEnabled(ApiBaseFeature.ChatUsername);
  const [editSidebar, setEditSidebar] = useState(false);
  const { sidebarFormRef, closeSidebar, handleClose } = useSidebarForm({
    onClose: () => setEditSidebar(false),
  });

  return (
    <Sheet
      component={"section"}
      aria-labelledby={"user-profiler-header"}
      sx={{
        display: "flex",
        flex: 1,
        flexBasis: "500px",
      }}
    >
      <OverlayBoundary>
        <UserProfileEditSidebar
          open={editSidebar}
          selfUser={user}
          sidebarFormRef={sidebarFormRef}
          selfGroups={groups}
          onClose={handleClose}
          onSuccess={closeSidebar}
        />
      </OverlayBoundary>

      <Stack gap={2} flex={1}>
        <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
          <Typography level={"h3"} component={"h2"} id={"user-profiler-header"}>
            Profil
          </Typography>
          {isSelf && (
            <EditButton
              aria-label={"Profil bearbeiten"}
              onClick={() => setEditSidebar(true)}
            />
          )}
        </Stack>

        <Stack
          gap={2}
          direction={{
            md: "row",
          }}
        >
          <Stack
            sx={{
              flexBasis: { md: "140px" },
            }}
          >
            <UserAvatar user={user} size={"lg"} />
          </Stack>

          <Stack
            gap={2}
            flex={1}
            direction={{
              md: "row",
            }}
            divider={<ResponsiveDivider />}
          >
            <DetailsColumn>
              <DetailsCell
                name={"firstName"}
                label={"Vorname"}
                value={user.firstName}
              />
              <DetailsCell
                name={"lastName"}
                label={"Name"}
                value={user.lastName}
              />
              <DetailsCell
                name={"username"}
                label={"Benutzername"}
                value={user.username}
              />
              <DetailsCell
                name={"enabled"}
                label={"Benutzerstatus"}
                value={user.enabled ? "" : "Deaktiviert"}
              />
            </DetailsColumn>

            <DetailsColumn>
              <ExternalLinkDetailsCell
                name={"email"}
                label={"E-Mail-Adresse"}
                value={user.email}
                href={emailHref}
              />
              <DetailsCell
                name={"phoneNumber"}
                label={"Telefonnummer"}
                value={user.phoneNumber}
              />
              {showChatUsername && (
                <DetailsCell
                  name={"externalChatUsername"}
                  label={"Chat"}
                  value={
                    isNullish(user.externalChatUsername) ? undefined : (
                      <InternalLink
                        href={routes.userRoom(user.externalChatUsername)}
                      >
                        {user.externalChatUsername}
                      </InternalLink>
                    )
                  }
                />
              )}
            </DetailsColumn>

            {groups.length > 0 && (
              <DetailsColumn>
                <DetailsCell
                  name={"groups"}
                  label={"Abteilung"}
                  value={<GroupList groups={groups} />}
                  valueIsDiv
                />
              </DetailsColumn>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Sheet>
  );
}
