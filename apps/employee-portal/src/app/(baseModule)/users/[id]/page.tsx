/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { use } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps, formatUserName } from "@eshg/lib-portal";

import { useGetUserProfile } from "@/lib/baseModule/api/queries/users";
import { UserAbsence } from "@/lib/baseModule/components/users/UserAbsence";
import { UserProfileDetails } from "@/lib/baseModule/components/users/UserProfileDetails";
import { routes } from "@/lib/baseModule/shared/routes";

export default function UserProfilePage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const query = useGetUserProfile(id);
  const { user, groups, title, salutation, isSelf, calendarEvents } =
    query.data;

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={formatUserName(user)}
          backButton={<ToolbarBackButton href={routes.users.index} />}
        />
      }
    >
      <MainContentLayout>
        <Stack
          flexWrap="wrap"
          gap={2}
          sx={{
            flexDirection: { md: "row" },
          }}
        >
          <UserProfileDetails
            user={user}
            groups={groups}
            isSelf={isSelf}
            title={title}
            salutation={salutation}
          />
          <UserAbsence events={calendarEvents} isSelf={isSelf} />
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
