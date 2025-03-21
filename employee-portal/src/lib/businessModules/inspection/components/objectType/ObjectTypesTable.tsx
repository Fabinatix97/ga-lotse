/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { ApiObjectType } from "@eshg/inspection-api";
import {
  DataTable,
  TablePage,
  TableSheet,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";

import { useEditObjectTypeSidebar } from "./EditObjectTypeSidebar";

export function ObjectTypesTable() {
  const { data: objectTypes, isFetching } = useGetObjectTypes();
  const canEdit = useHasUserRoleCheck(ApiUserRole.InspectionObjecttypesWrite);

  const sidebar = useEditObjectTypeSidebar();

  const columnHelper: ColumnHelper<ApiObjectType> =
    createColumnHelper<ApiObjectType>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      meta: {
        width: "40%",
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("routineInterval", {
      header: "Intervall (Tage)",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("complaintInterval", {
      header: "nach Beanst. (Tage)",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("standardDuration", {
      header: "Dauer (Std.)",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];

  return (
    <TablePage fullHeight>
      <TableSheet loading={isFetching}>
        <DataTable
          data={objectTypes}
          columns={columns}
          rowNavigation={
            canEdit
              ? {
                  onClick: (row) => () => {
                    sidebar.open({ objectType: row.original });
                  },
                  focusColumnAccessorKey: "name",
                }
              : undefined
          }
          striped
        />
      </TableSheet>
    </TablePage>
  );
}
