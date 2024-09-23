/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/LockOutlined";
import { Button, Chip, Sheet, Stack } from "@mui/joy";
import { useState } from "react";

import { useGetUserOverviewPageQuery } from "@/lib/baseModule/api/queries/users";
import { SuggestNewUserFormSidebar } from "@/lib/baseModule/components/users/SuggestNewUserSidebar";
import { useUserTableColumns } from "@/lib/baseModule/components/users/columns";
import { businessModuleLeaderRoles } from "@/lib/baseModule/moduleRegister/moduleUserGroupResolver";
import { routes } from "@/lib/baseModule/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

export function UserTable() {
  const {
    data: { users, selfGroups },
    isFetching,
  } = useGetUserOverviewPageQuery();

  const [open, setOpen] = useState(false);
  const isLeader = useHasUserRolesCheck(businessModuleLeaderRoles).some(
    (b) => b,
  );

  const userColumns = useUserTableColumns();

  return (
    <>
      <TablePage
        fullHeight
        controls={
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            flexWrap={"wrap"}
            gap={2}
          >
            <Sheet
              sx={{
                paddingInline: 1,
                paddingBlock: 0.5,
                minWidth: "fit-content",
                display: "flex",
                alignItems: "center",
                gap: "1ch",
              }}
            >
              Aktive Filter:
              <Chip
                variant={"soft"}
                color={"primary"}
                startDecorator={<LockIcon />}
              >
                Eigene Abteilungen
              </Chip>
            </Sheet>
            {isLeader && (
              <Button
                startDecorator={<AddIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  minWidth: "fit-content",
                }}
              >
                Neuen Benutzer vorschlagen
              </Button>
            )}
          </Stack>
        }
      >
        <TableSheet loading={isFetching}>
          <DataTable
            minWidth="75rem"
            columns={userColumns}
            data={users}
            rowNavRoute={(row) => routes.users.details(row.original.userId)}
            focusColumnHeader="Name"
          />
        </TableSheet>
      </TablePage>

      {isLeader && (
        <OverlayBoundary>
          <SuggestNewUserFormSidebar
            open={open}
            onClose={() => setOpen(false)}
            availableGroups={selfGroups}
          />
        </OverlayBoundary>
      )}
    </>
  );
}
