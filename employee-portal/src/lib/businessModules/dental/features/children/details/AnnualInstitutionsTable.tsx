/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AnnualInstitution } from "@eshg/dental/api/models/Institution";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { formatSchoolYear } from "@/lib/shared/helpers/formatters";

interface AnnualInstitutionsTableProps {
  institutions: AnnualInstitution[];
  isFetching: boolean;
}

export function AnnualInstitutionsTable(props: AnnualInstitutionsTableProps) {
  return (
    <TablePage fullHeight>
      <TableSheet loading={props.isFetching}>
        <DataTable
          data={props.institutions}
          columns={COLUMNS}
          enableSortingRemoval={false}
          minWidth={500}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<AnnualInstitution>();
const COLUMNS = [
  columnHelper.accessor("institution.name", {
    header: "Einrichtung",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 120,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("year", {
    header: "Schuljahr",
    cell: (props) => formatSchoolYear(props.getValue()),
    enableSorting: true,
    meta: {
      width: 90,
      canNavigate: { parentRow: true },
    },
  }),
];
