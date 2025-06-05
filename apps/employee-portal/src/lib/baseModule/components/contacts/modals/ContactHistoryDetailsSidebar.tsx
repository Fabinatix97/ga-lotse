/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { ApiHistoryEntryType, ApiUser } from "@eshg/base-api";
import {
  Sidebar,
  SidebarActions,
  SidebarContent,
} from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal";

import { UserLink } from "@/lib/shared/components/users/UserLink";

interface ContactHistoryModalProps {
  title: string;
  type: ApiHistoryEntryType;
  modifiedAt: Date;
  modifiedBy?: ApiUser;
  children: ReactNode;
}

const translatedType: Record<ApiHistoryEntryType, string> = {
  ADD: "hinzugefügt",
  MOD: "geändert",
  DEL: "gelöscht",
};

export function ContactHistoryDetailsSidebar({
  title,
  type,
  modifiedAt,
  modifiedBy,
  children,
}: ContactHistoryModalProps) {
  const router = useRouter();

  function handleClose() {
    router.back();
  }

  return (
    <Sidebar open onClose={handleClose}>
      <SidebarContent title={title}>
        <Typography level="body-sm">
          {formatDateTime(modifiedAt, "de")}, {translatedType[type]} von{" "}
          <UserLink user={modifiedBy} />
        </Typography>
        <Stack marginTop={1}>{children}</Stack>
      </SidebarContent>
      <SidebarActions>
        <Button
          sx={{ alignSelf: "flex-end" }}
          color="primary"
          onClick={handleClose}
        >
          Okay
        </Button>
      </SidebarActions>
    </Sidebar>
  );
}
