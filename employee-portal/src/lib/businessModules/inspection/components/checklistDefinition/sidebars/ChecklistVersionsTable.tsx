/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiChecklistDefinitionVersion } from "@eshg/employee-portal-api/inspection";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Lock } from "@mui/icons-material";
import { Stack } from "@mui/joy";
import {
  CellContext,
  ColumnHelper,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import { isNonNullish } from "remeda";

import { isUnknownUser } from "@/lib/businessModules/inspection/shared/isUnknownUser";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { UserLink } from "@/lib/shared/components/users/UserLink";

const columnHelper: ColumnHelper<ApiChecklistDefinitionVersion> =
  createColumnHelper<ApiChecklistDefinitionVersion>();

export function ChecklistVersionsTable({
  versions,
}: Readonly<{
  versions: ApiChecklistDefinitionVersion[];
}>) {
  function versionCellRenderFunction(
    props: CellContext<ApiChecklistDefinitionVersion, number>,
  ): ReactNode {
    let repoVersionString = "";
    if (isNonNullish(props.row.original.context.repositoryVersion)) {
      repoVersionString = `R${props.row.original.context.repositoryVersion.toString()}-`;
    }
    return (
      <Stack direction="row" spacing={0.5}>
        {!props.row.original.context.expandable && <Lock />}
        {repoVersionString + props.row.original.context.version.toString()}
      </Stack>
    );
  }

  const columns = [
    columnHelper.accessor("context.name", {
      header: "Name",
      cell: (info) => (
        <InternalLink
          href={routes.checklists.definitions.viewVersion(
            info.row.original.context.defId,
            info.row.original.context.id,
          )}
        >
          {info.renderValue()}
        </InternalLink>
      ),
    }),
    columnHelper.accessor("context.version", {
      header: "Version",
      cell: versionCellRenderFunction,
    }),
    columnHelper.accessor("modifiedBy", {
      header: "Zuletzt bearbeitet",
      cell: (props) => {
        const modifiedBy = props.getValue();

        if (!modifiedBy || isUnknownUser(modifiedBy)) {
          return;
        }

        return <UserLink user={modifiedBy} />;
      },
    }),
    columnHelper.accessor("context.validFrom", {
      header: "Zuletzt bearbeitet",
      cell: (props) => formatDateTime(props.getValue()),
    }),
  ];

  const initialSorting: SortingState = [
    {
      id: "context_version",
      desc: true,
    },
  ];
  return (
    <DataTable
      data={versions}
      columns={columns}
      sorting={{
        manualSorting: false,
        initialSorting,
      }}
    />
  );
}
