/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { ApiSchoolYearTransitionSortKey } from "@eshg/dental-api";
import {
  DataTable,
  MainContentLayout,
  Pagination,
  StickyToolbarLayout,
  TablePage,
  TableSheet,
  Toolbar,
  ToolbarBackButton,
  formatSchoolYear,
  getSortDirection,
  getSortKey,
  useTableControl,
} from "@eshg/lib-employee-portal";

import { SchoolYearTransitionStatusChip } from "@/components/schoolYearTransition/SchoolYearTransitionStatusChip";
import { routes } from "@/config/routes";
import { useDentalApi } from "@/contexts/dental";
import { InstitutionForTransition } from "@/features/children/api/models/SchoolYearTransitionResult";
import { getSchoolsForTransitionQuery } from "@/features/children/api/queries/schoolYearTransition";

const columnHelper = createColumnHelper<InstitutionForTransition>();
function columns(institutionHeader: string) {
  return [
    columnHelper.accessor("institution.name", {
      header: institutionHeader,
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 250,
      },
    }),
    columnHelper.accessor("institution.city", {
      header: "Ort",
      cell: (props) => props.getValue(),
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 250,
      },
    }),
    columnHelper.accessor("institution.street", {
      header: "Straße",
      cell: (props) =>
        `${props.getValue()} ${props.row.original.institution.houseNumber ?? ""}`,
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 300,
      },
    }),
    columnHelper.accessor("completedCount", {
      header: "Bearbeitete Gruppen",
      cell: (props) => `${props.getValue()} / ${props.row.original.totalCount}`,
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 250,
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => (
        <SchoolYearTransitionStatusChip status={props.getValue()} />
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
      enableSorting: true,
    }),
  ];
}

const initialSorting: ColumnSort = {
  id: "status",
  desc: true,
};

interface SchoolYearTransitionPageProps {
  titleSuffix: string;
  tableHeader: string;
}

export function SchoolYearTransitionBasePage(
  props: SchoolYearTransitionPageProps,
) {
  const { childApi } = useDentalApi();
  const currentSchoolYear = formatSchoolYear(new Date().getFullYear() - 1);
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });
  const { data: institutionsForTransition } = useSuspenseQuery(
    getSchoolsForTransitionQuery(childApi, {
      sortKey: getSortKey(tableControl.tableSorting, SORT_KEY_MAPPING),
      sortDirection: getSortDirection(tableControl.tableSorting),
      pageNumber: tableControl.paginationProps.pageNumber,
      pageSize: tableControl.paginationProps.pageSize,
    }),
  );

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Schuljahr ${currentSchoolYear} abschließen - ${props.titleSuffix}`}
          backButton={<ToolbarBackButton href={routes.children.overview} />}
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <TablePage data-testid="institutionsTable">
          <TableSheet
            footer={
              <Pagination
                totalCount={institutionsForTransition.totalNumberOfElements}
                {...tableControl.paginationProps}
              />
            }
          >
            <DataTable
              data={institutionsForTransition.elements}
              columns={columns(props.tableHeader)}
              enableSortingRemoval={false}
              rowNavigation={{
                route: (row) =>
                  routes.children.schoolYearTransition.groups(
                    row.original.institution.id,
                  ),
                focusColumnAccessorKey: "institution.name",
              }}
              minWidth={1250}
              sorting={tableControl.tableSorting}
            />
          </TableSheet>
        </TablePage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

const SORT_KEY_MAPPING: Record<string, ApiSchoolYearTransitionSortKey> = {
  institution_name: ApiSchoolYearTransitionSortKey.Name,
  completedCount: ApiSchoolYearTransitionSortKey.CompletedCount,
  status: ApiSchoolYearTransitionSortKey.Status,
};
