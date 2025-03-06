/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { Stack } from "@mui/joy";

import { useGetUserProfile } from "@/lib/baseModule/api/queries/users";
import { UserAbsence } from "@/lib/baseModule/components/users/UserAbsence";
import { UserProfileDetails } from "@/lib/baseModule/components/users/UserProfileDetails";
import { routes } from "@/lib/baseModule/shared/routes";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export default function UserProfilePage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const query = useGetUserProfile(params.id);
  const { user, groups, title, salutation, isSelf, calendarEvents } =
    query.data;

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title={fullName(user)} backHref={routes.users.index} />}
    >
      <MainContentLayout>
        <Stack
          flexWrap={"wrap"}
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
