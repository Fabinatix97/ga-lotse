/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiBaseFeature,
  ApiSalutation,
  ApiUser,
  ApiUserGroup,
} from "@eshg/base-api";
import {
  DetailsColumn,
  DetailsRow,
  EditButton,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { SALUTATION_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Sheet, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { GroupList } from "@/lib/baseModule/components/users/GroupList";
import { useUserProfileEditSidebar } from "@/lib/baseModule/components/users/userSidebar/UserProfileEditSidebar";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import {
  ExternalLinkDetailsCell,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";

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
  const showChatUsername = useIsNewFeatureEnabled(ApiBaseFeature.ChatUsername);
  const updateSidebar = useUserProfileEditSidebar();

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
      <Stack gap={2} flex={1}>
        <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
          <Typography level={"h3"} component={"h2"} id={"user-profiler-header"}>
            Profil
          </Typography>
          {isSelf && (
            <EditButton
              aria-label={"Profil bearbeiten"}
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
              {isDefined(salutation ?? title) && (
                <DetailsRow>
                  {isDefined(salutation) &&
                    salutation !== ApiSalutation.NotSpecified && (
                      <DetailsCell
                        name="salutation"
                        label="Anrede"
                        value={SALUTATION_VALUES[salutation]}
                      />
                    )}
                  <DetailsCell name="title" label="Titel" value={title} />
                </DetailsRow>
              )}

              <DetailsCell
                name={"firstName"}
                label={"Vorname"}
                value={user.firstName}
              />
              <DetailsCell
                name={"lastName"}
                label={"Nachname"}
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
              {showChatUsername && user.externalChatUsername && (
                <>
                  <DetailsCell
                    name={"externalChatUsername"}
                    label={"Chat-ID"}
                    valueIsDiv
                    value={
                      <ChatUserId userId={user.externalChatUsername} noLabel />
                    }
                  />
                  {!isSelf && (
                    <InternalLinkButton
                      href={routes.userRoom(user.externalChatUsername)}
                      startDecorator={<ChatOutlinedIcon />}
                      variant="outlined"
                      sx={{ alignSelf: "flex-start", maxWidth: "100%", mt: 1 }}
                    >
                      Direktnachricht
                    </InternalLinkButton>
                  )}
                </>
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
