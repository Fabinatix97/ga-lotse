/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ApiUserRole } from "@eshg/base-api";
import {
  ApiObjectType,
  ApiObjectTypeHierarchyTreeNode,
} from "@eshg/inspection-api";
import {
  DataTable,
  TablePage,
  TableSheet,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";

import { useGetObjectTypeHierarchyTree } from "@/lib/businessModules/inspection/api/queries/objectTypes";

import { useEditObjectTypeSidebar } from "./EditObjectTypeSidebar";

export function ObjectTypesTable() {
  const canEdit = useHasUserRoleCheck(ApiUserRole.InspectionObjecttypesWrite);
  const { data: objectTypeHierarchyTree, isFetching } =
    useGetObjectTypeHierarchyTree();

  const sidebar = useEditObjectTypeSidebar();

  const columnHelper: ColumnHelper<
    ApiObjectTypeHierarchyTreeNode | ApiObjectType
  > = createColumnHelper<ApiObjectTypeHierarchyTreeNode | ApiObjectType>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      meta: {
        indentSubRows: true,
        width: "40%",
        indentSize: 24,
        canNavigate: {
          parentRow: false,
          subRow: true,
        },
      },
    }),
    columnHelper.accessor("routineInterval", {
      header: "Intervall (Tage)",
      meta: {
        canNavigate: {
          parentRow: false,
          subRow: true,
        },
      },
    }),
    columnHelper.accessor("complaintInterval", {
      header: "nach Beanst. (Tage)",
      meta: {
        canNavigate: {
          parentRow: false,
          subRow: true,
        },
      },
    }),
    columnHelper.accessor("standardDuration", {
      header: "Dauer (Std.)",
      meta: {
        canNavigate: {
          parentRow: false,
          subRow: true,
        },
      },
    }),
  ];

  function isApiObjectType(
    row: ApiObjectTypeHierarchyTreeNode | ApiObjectType,
  ): row is ApiObjectType {
    return !("subNodes" in row);
  }

  return (
    <TablePage fullHeight>
      <TableSheet loading={isFetching}>
        <DataTable
          data={objectTypeHierarchyTree}
          indentSize={24}
          indentSubRows
          columns={columns}
          getSubRows={getSubRows}
          minWidth={1000}
          rowNavigation={
            canEdit
              ? {
                  onClick: (row) => () => {
                    if (isApiObjectType(row.original)) {
                      sidebar.open({ objectType: row.original });
                    }
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

export function getSubRows(
  originalRow: ApiObjectTypeHierarchyTreeNode | ApiObjectType,
): (ApiObjectType | ApiObjectTypeHierarchyTreeNode)[] | undefined {
  if ("subNodes" in originalRow) {
    const objectTypes = originalRow.objectTypes ?? [];
    const subNodes = originalRow.subNodes ?? [];

    const combined = [...objectTypes, ...subNodes];

    return combined.length > 0 ? combined : undefined;
  }

  return undefined;
}
