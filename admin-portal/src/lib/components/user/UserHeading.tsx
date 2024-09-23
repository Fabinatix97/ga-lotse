/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Person } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useState } from "react";

import { Sidebar } from "@/lib/components/sidebar/Sidebar";
import { UserSidebar } from "@/lib/components/user/UserSidebar";
import { getAdminName } from "@/lib/helpers/adminName";

export function UserHeading() {
  const [openDetails, setOpenDetails] = useState(false);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const adminName = getAdminName();

  return (
    <Stack alignItems="center" gap={1}>
      <Button
        startDecorator={adminName && <Person color="inherit" />}
        onClick={() => setOpenDetails(!openDetails)}
        loading={!!(isFetching + isMutating)}
      >
        <Typography>{adminName}</Typography>
      </Button>
      <Sidebar open={openDetails} onClose={setOpenDetails}>
        <UserSidebar onClick={setOpenDetails} />
      </Sidebar>
    </Stack>
  );
}
