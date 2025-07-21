/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, Edit, History } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { CellContext, createColumnHelper } from "@tanstack/react-table";

import {
  ApiPacklistDefinition,
  ApiPacklistDefinitionRevision,
} from "@eshg/inspection-api";
import {
  ActionsMenu,
  ButtonBar,
  DataTable,
  TablePage,
  TableSheet,
} from "@eshg/lib-employee-portal";
import { ButtonLink } from "@eshg/lib-portal";

import { useGetPacklistDefinitions } from "@/lib/businessModules/inspection/api/queries/packlistDefinition";
import { usePacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/PacklistDefinitionSidebar";

const columnHelper = createColumnHelper<ApiPacklistDefinition>();

export function PacklistDefinitionOverviewTable() {
  const { data: packlists, isFetching } = useGetPacklistDefinitions();
  const sidebar = usePacklistDefinitionSidebar();

  function openCreatePacklist() {
    sidebar.open({
      mode: "create",
    });
  }

  function openEditPacklist(
    packlistDefinitionId: string,
    version: number,
    revisionId: string,
  ) {
    sidebar.open({
      mode: "edit",
      packlistDefinitionId,
      version,
      revisionId,
    });
  }

  function openPacklistHistory(packlistDefinitionId: string, version: number) {
    sidebar.open({
      mode: "history",
      packlistDefinitionId,
      version,
    });
  }

  function openPacklistRevision(
    packlistDefinitionId: string,
    version: number,
    revisionId: string,
  ) {
    sidebar.open({
      mode: "view",
      packlistDefinitionId,
      version,
      revisionId,
    });
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
            openPacklistRevision(
              info.row.original.id,
              info.row.original.version,
              info.row.original.mostRecentRevisionId,
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
                  openEditPacklist(
                    packlistRow.id,
                    packlistRow.version,
                    packlistRow.mostRecentRevisionId,
                  ),
                startDecorator: <Edit />,
              },
              {
                label: "Historie",
                onClick: () => {
                  openPacklistHistory(packlistRow.id, packlistRow.version);
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
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          right={
            <Button
              type="submit"
              startDecorator={<Add />}
              onClick={openCreatePacklist}
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
  );
}
