/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import {
  DataTable,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps, formatDate } from "@eshg/lib-portal";

import { ExaminationStatusChip } from "../../../components/examination/ExaminationStatusChip";
import { routes } from "../../../config/routes";
import { useDentalApi } from "../../../contexts/dental";
import { PROPHYLAXIS_TYPES } from "../../../translations/prophylaxisSession";
import { ChildExamination } from "../api/models/ChildExamination";
import { getChildDetailsQuery } from "../api/queries/details";
import { useChildRouteParams } from "../hooks/useChildRouteParams";
import { DentalChildRouteParams } from "../schemas/DentalChildRouteParams";

const columnHelper = createColumnHelper<ChildExamination>();
const COLUMNS = [
  columnHelper.accessor("dateAndTime", {
    header: "Datum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: false,
    meta: {
      width: 150,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("prophylaxisType", {
    header: "Typ",
    cell: (props) => PROPHYLAXIS_TYPES[props.getValue()],
    enableSorting: false,
    meta: {
      width: 250,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("note", {
    header: "Bemerkung",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (props) => <ExaminationStatusChip status={props.getValue()} />,
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
];

const initialSorting: ColumnSort = {
  id: "dateAndTime",
  desc: true,
};

export function DentalChildExaminationsOverviewPage(
  props: DynamicPageProps<DentalChildRouteParams>,
) {
  const { childId } = useChildRouteParams(props.params);
  const { childApi } = useDentalApi();
  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, childId),
  );

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting,
  });

  return (
    <TablePage>
      <TableSheet>
        <DataTable
          data={child.examinations}
          columns={COLUMNS}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          rowNavigation={{
            route: (row) =>
              routes.children.byId(child.id).examinations.byId(row.original.id),
            focusColumnAccessorKey: "dateAndTime",
          }}
          minWidth={600}
        />
      </TableSheet>
    </TablePage>
  );
}
