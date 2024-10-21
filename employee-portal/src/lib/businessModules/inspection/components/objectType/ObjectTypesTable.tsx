/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiObjectType } from "@eshg/employee-portal-api/inspection";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { EditObjectTypeSidebar } from "./EditObjectTypeSidebar";

type SidebarState =
  | { type: "closed" }
  | { type: "edit"; selected: ApiObjectType };

export function ObjectTypesTable() {
  const { data: objectTypes, isFetching } = useGetObjectTypes();
  const canEdit = useHasUserRoleCheck(ApiUserRole.InspectionObjecttypesWrite);

  const [sidebarState, setSidebarState] = useState<SidebarState>({
    type: "closed",
  });

  const columnHelper: ColumnHelper<ApiObjectType> =
    createColumnHelper<ApiObjectType>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      meta: {
        width: "40%",
      },
    }),
    columnHelper.accessor("routineInterval", {
      header: "Intervall (Tage)",
    }),
    columnHelper.accessor("complaintInterval", {
      header: "nach Beanst. (Tage)",
    }),
    columnHelper.accessor("standardDuration", {
      header: "Dauer (Std.)",
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "navigationControl",
      cell: (props) =>
        canEdit && (
          <IconButton
            aria-label="Objekttyp bearbeiten"
            color="primary"
            onClick={() =>
              setSidebarState({ type: "edit", selected: props.row.original })
            }
            sx={{
              float: "right",
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        ),
      meta: {
        cellStyle: "button",
      },
    }),
  ];

  return (
    <>
      <TablePage fullHeight>
        <TableSheet loading={isFetching}>
          <DataTable data={objectTypes} columns={columns} striped />
        </TableSheet>
      </TablePage>

      {canEdit && sidebarState.type === "edit" && (
        <EditObjectTypeSidebar
          open={sidebarState.type === "edit"}
          onClose={() => setSidebarState({ type: "closed" })}
          objectType={sidebarState.selected}
        />
      )}
    </>
  );
}
