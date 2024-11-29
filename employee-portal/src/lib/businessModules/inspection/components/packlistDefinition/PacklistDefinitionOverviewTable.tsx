/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiPacklistDefinition,
  ApiPacklistDefinitionRevision,
} from "@eshg/employee-portal-api/inspection";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { Add, Edit, History } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { useGetPacklistDefinitions } from "@/lib/businessModules/inspection/api/queries/packlistDefinition";
import { CreatePacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/CreatePacklistDefinitionSidebar";
import { EditPacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/EditPacklistDefinitionSidebar";
import { PacklistRevisionsSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/sidebars/PacklistRevisionsSidebar";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

const columnHelper = createColumnHelper<ApiPacklistDefinition>();

type UserActivityState =
  | { type: "create-packlist" }
  | {
      type: "edit-packlist";
      packlistDefinitionId: string;
      revisionId: string;
      version: number;
    }
  | {
      type: "view-packlist-revision";
      packlistDefinitionId: string;
      revisionId: string;
      returnToViewHistory: boolean;
      version: number;
    }
  | { type: "view-table" }
  | { type: "view-history"; packlistDefinitionId: string; version: number };

const initialUserActivity: UserActivityState = { type: "view-table" };

export function PacklistDefinitionOverviewTable() {
  const { data: packlists, isFetching } = useGetPacklistDefinitions();

  const [userActivity, setUserActivity] =
    useState<UserActivityState>(initialUserActivity);

  function handleAddButtonClick() {
    setUserActivity({
      type: "create-packlist",
    });
  }

  function handleEditButtonClick(
    defId: string,
    version: number,
    revisionId: string,
  ) {
    setUserActivity({
      type: "edit-packlist",
      packlistDefinitionId: defId,
      version: version,
      revisionId: revisionId,
    });
  }

  function handleHistoryButtonClick(defId: string, version: number) {
    setUserActivity({
      type: "view-history",
      packlistDefinitionId: defId,
      version: version,
    });
  }

  function handleViewRevisionClick(
    defId: string,
    version: number,
    revisionId: string,
    returnToViewHistory: boolean,
  ) {
    setUserActivity({
      type: "view-packlist-revision",
      packlistDefinitionId: defId,
      version: version,
      revisionId: revisionId,
      returnToViewHistory: returnToViewHistory,
    });
  }

  function handleSidebarClosed() {
    if (
      userActivity.type === "view-packlist-revision" &&
      userActivity.returnToViewHistory
    ) {
      setUserActivity({
        type: "view-history",
        packlistDefinitionId: userActivity.packlistDefinitionId,
        version: userActivity.version,
      });
    } else {
      setUserActivity(initialUserActivity);
    }
  }

  function revisionsCellRenderFunction(
    props: CellContext<ApiPacklistDefinition, ApiPacklistDefinitionRevision[]>,
  ): string {
    return props.row.original.mostRecentRevisionNr.toString();
  }

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <ButtonLink
          onClick={() =>
            handleViewRevisionClick(
              info.row.original.id,
              info.row.original.version,
              info.row.original.mostRecentRevisionId,
              false,
            )
          }
        >
          <Stack direction="row" spacing={0.5}>
            {info.renderValue()}
          </Stack>
        </ButtonLink>
      ),
    }),

    columnHelper.accessor("revisions", {
      header: "Version",
      cell: revisionsCellRenderFunction,
      sortingFn: (colA, colB) => {
        return (
          0 ||
          colA.original.mostRecentRevisionNr -
            colB.original.mostRecentRevisionNr
        );
      },
    }),
    columnHelper.accessor("objectType.name", {
      header: "Objekttyp",
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      enableSorting: false,
      cell: (info) => {
        const packlistRow = info.row.original;
        return (
          <ActionsMenu
            actionItems={[
              {
                label: "Anpassen",
                onClick: () =>
                  handleEditButtonClick(
                    packlistRow.id,
                    packlistRow.version,
                    packlistRow.mostRecentRevisionId,
                  ),
                startDecorator: <Edit />,
              },
              {
                label: "Historie",
                onClick: () => {
                  handleHistoryButtonClick(packlistRow.id, packlistRow.version);
                },
                startDecorator: <History />,
              },
            ]}
          />
        );
      },
      meta: {
        cellStyle: "button",
        width: "7rem",
        textAlign: "right",
      },
    }),
  ];

  return (
    <>
      <TablePage
        fullHeight
        controls={
          <ButtonBar
            right={
              <Button
                type={"submit"}
                onClick={handleAddButtonClick}
                startDecorator={<Add />}
              >
                Neue Definition anlegen
              </Button>
            }
          />
        }
      >
        <TableSheet loading={isFetching}>
          <DataTable data={packlists} columns={columns} striped />
        </TableSheet>
      </TablePage>

      {userActivity.type === "create-packlist" && (
        <CreatePacklistDefinitionSidebar onClose={handleSidebarClosed} />
      )}
      {userActivity.type === "edit-packlist" && (
        <EditPacklistDefinitionSidebar
          onClose={handleSidebarClosed}
          readonly={false}
          revisionId={userActivity.revisionId}
          version={userActivity.version}
        />
      )}
      {userActivity.type === "view-packlist-revision" && (
        <EditPacklistDefinitionSidebar
          onClose={handleSidebarClosed}
          readonly={true}
          revisionId={userActivity.revisionId}
          onClickNewRevision={handleEditButtonClick}
          version={userActivity.version}
        />
      )}
      {userActivity.type === "view-history" && (
        <PacklistRevisionsSidebar
          open
          onClose={handleSidebarClosed}
          packlistDefinitionId={userActivity.packlistDefinitionId}
          onClickOnRevision={(defId, version, revisionId) =>
            handleViewRevisionClick(defId, version, revisionId, true)
          }
          onClickNewRevision={handleEditButtonClick}
          version={userActivity.version}
        />
      )}
    </>
  );
}
