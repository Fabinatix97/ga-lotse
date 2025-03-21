/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DataTable,
  TablePage,
  TableSheet,
  useHasUserRolesCheck,
} from "@eshg/lib-employee-portal";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/LockOutlined";
import { Button, Chip, Sheet, Stack } from "@mui/joy";

import { useGetUserOverviewPageQuery } from "@/lib/baseModule/api/queries/users";
import { useSuggestNewUserSidebar } from "@/lib/baseModule/components/users/SuggestNewUserSidebar";
import { useUserTableColumns } from "@/lib/baseModule/components/users/columns";
import { businessModuleLeaderRoles } from "@/lib/baseModule/moduleRegister/moduleUserGroupResolver";
import { routes } from "@/lib/baseModule/shared/routes";

export function UserTable() {
  const {
    data: { users, selfGroups },
    isFetching,
  } = useGetUserOverviewPageQuery();

  const isLeader = useHasUserRolesCheck(businessModuleLeaderRoles).some(
    (b) => b,
  );

  const userColumns = useUserTableColumns();
  const suggestUserSidebar = useSuggestNewUserSidebar();

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
                onClick={() =>
                  suggestUserSidebar.open({
                    availableGroups: selfGroups,
                  })
                }
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
            rowNavigation={{
              route: (row) => routes.users.details(row.original.userId),
              focusColumnAccessorKey: "lastName",
            }}
          />
        </TableSheet>
      </TablePage>
    </>
  );
}
