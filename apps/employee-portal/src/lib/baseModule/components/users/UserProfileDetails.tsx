/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Sheet, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import {
  ApiSalutation,
  ApiUser,
  ApiUserGroup,
  ApiUserRole,
} from "@eshg/base-api";
import {
  DetailsItem,
  DetailsRow,
  EditButton,
  ResponsiveDivider,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import {
  DetailsColumn,
  DetailsList,
  InternalLinkButton,
  SALUTATION_VALUES,
} from "@eshg/lib-portal";

import { GroupList } from "@/lib/baseModule/components/users/GroupList";
import { useUserProfileEditSidebar } from "@/lib/baseModule/components/users/userSidebar/UserProfileEditSidebar";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import {
  ExternalLinkDetailsItem,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsItem";

import { UserAvatar } from "./UserAvatar";

export function UserProfileDetails({
  user,
  salutation,
  title,
  groups,
  isSelf,
}: {
  user: ApiUser;
  salutation: ApiSalutation | undefined;
  title: string | undefined;
  groups: ApiUserGroup[];
  isSelf: boolean;
}) {
  const updateSidebar = useUserProfileEditSidebar();
  const hasChatUserRole = useHasUserRoleCheck(ApiUserRole.ChatUser);

  return (
    <Sheet
      component="section"
      aria-labelledby="user-profiler-header"
      sx={{
        display: "flex",
        flex: 1,
        flexBasis: "500px",
      }}
    >
      <DetailsList>
        <Stack gap={2} flex={1}>
          <Stack direction="row" gap={1} justifyContent="space-between">
            <Typography level="h3" component="h2" id="user-profiler-header">
              Profil
            </Typography>
            {isSelf && (
              <EditButton
                aria-label="Profil bearbeiten"
                onClick={() =>
                  updateSidebar.open({
                    selfUser: user,
                    selfGroups: groups,
                    selfTitle: title,
                    selfSalutation: salutation,
                  })
                }
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
              <UserAvatar user={user} size="lg" />
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
                {isDefined(salutation ?? title) && (
                  <DetailsRow>
                    {isDefined(salutation) &&
                      salutation !== ApiSalutation.NotSpecified && (
                        <DetailsItem
                          label="Anrede"
                          value={SALUTATION_VALUES[salutation]}
                        />
                      )}
                    <DetailsItem label="Titel" value={title} />
                  </DetailsRow>
                )}

                <DetailsItem label="Vorname" value={user.firstName} />
                <DetailsItem label="Nachname" value={user.lastName} />
                <DetailsItem label="Benutzername" value={user.username} />
                <DetailsItem
                  label="Benutzerstatus"
                  value={user.enabled ? "" : "Deaktiviert"}
                />
              </DetailsColumn>

              <DetailsColumn>
                <ExternalLinkDetailsItem
                  label="E-Mail-Adresse"
                  value={user.email}
                  href={emailHref}
                />
                <DetailsItem label="Telefonnummer" value={user.phoneNumber} />
                {user.externalChatUsername && hasChatUserRole && (
                  <>
                    <DetailsItem
                      label="Chat-ID"
                      value={
                        <ChatUserId
                          userId={user.externalChatUsername}
                          noLabel
                        />
                      }
                    />
                    {!isSelf && (
                      <InternalLinkButton
                        href={routes.userRoom(user.externalChatUsername)}
                        startDecorator={<ChatOutlinedIcon />}
                        variant="outlined"
                        sx={{
                          alignSelf: "flex-start",
                          maxWidth: "100%",
                          mt: 1,
                        }}
                      >
                        Direktnachricht
                      </InternalLinkButton>
                    )}
                  </>
                )}
              </DetailsColumn>

              {groups.length > 0 && (
                <DetailsColumn>
                  <DetailsItem
                    label="Abteilung"
                    value={<GroupList groups={groups} />}
                  />
                </DetailsColumn>
              )}
            </Stack>
          </Stack>
        </Stack>
      </DetailsList>
    </Sheet>
  );
}
