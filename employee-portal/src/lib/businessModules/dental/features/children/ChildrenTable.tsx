/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import { Child } from "@/lib/businessModules/dental/api/models/Child";
import { useGetChildrenQuery } from "@/lib/businessModules/dental/api/queries/childApi";
import { routes } from "@/lib/businessModules/dental/shared/routes";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import {
  getSortDirection,
  getSortKey,
} from "@/lib/shared/components/table/sorting";
import { formatSchoolYear } from "@/lib/shared/helpers/formatters";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

const initialSorting: ColumnSort = {
  id: "id",
  desc: true,
};

interface ChildrenTableProps {
  buttons?: ReactNode[];
}

export function ChildrenTable(props: ChildrenTableProps) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const childrenQuery = useGetChildrenQuery({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey(tableControl.tableSorting),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.Dental,
  );

  const [children, gdprBanner] = useSuspenseQueries({
    queries: [childrenQuery, gdprBannerQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.Dental,
  });

  return (
    <TablePage
      fullHeight
      controls={<ButtonBar right={props.buttons} alignItems="flex-end" />}
    >
      <TableSheet
        loading={children.isFetching}
        footer={
          <Pagination
            totalCount={children.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={children.data.elements}
          columns={COLUMNS}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          minWidth={1200}
          rowNavigation={{
            focusColumnAccessorKey: "lastName",
            route: (row) => routes.children.byId(row.original.id).details,
          }}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<Child>();
const COLUMNS = [
  columnHelper.accessor("lastName", {
    header: "Name",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("firstName", {
    header: "Vorname",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("dateOfBirth", {
    header: "Geburtsdatum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: false,
    meta: {
      width: 90,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("institution.name", {
    header: "Einrichtung",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 50,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("year", {
    header: "Jahr",
    cell: (props) => formatSchoolYear(props.getValue()),
    enableSorting: false,
    meta: {
      width: 50,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];
