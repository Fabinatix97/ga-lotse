/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiHistoryEntryType, ApiUser } from "@eshg/base-api";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { UserLink } from "@/lib/shared/components/users/UserLink";

export interface ContactHistoryModalProps {
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
    <Sidebar onClose={handleClose} open>
      <SidebarContent title={title}>
        <Typography level={"body-sm"}>
          {formatDateTime(modifiedAt, "de")}, {translatedType[type]} von{" "}
          <UserLink user={modifiedBy} />
        </Typography>
        <Stack marginTop={1}>{children}</Stack>
      </SidebarContent>
      <SidebarActions>
        <Button
          onClick={handleClose}
          sx={{ alignSelf: "flex-end" }}
          color={"primary"}
        >
          Okay
        </Button>
      </SidebarActions>
    </Sidebar>
  );
}
