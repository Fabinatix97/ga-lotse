/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { ApiChildForTransitionSortKey } from "@eshg/dental-api";
import {
  DataTable,
  MainContentLayout,
  StickyToolbarLayout,
  TablePage,
  TableSheet,
  Toolbar,
  ToolbarBackButton,
  formatSchoolYear,
  getSortDirection,
  getSortKey,
  useGetContactQueryOptions,
  useRowSelection,
  useSyncRowSelection,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  Alert,
  DynamicPageProps,
  GENDER_VALUES,
  formatDate,
} from "@eshg/lib-portal";

import { routes } from "../../../config/routes";
import { useDentalApi } from "../../../contexts/dental";
import { ChildForTransition } from "../api/models/SchoolYearTransitionChildResult";
import { getChildrenForTransitionQuery } from "../api/queries/schoolYearTransition";
import { NoDataAvailable } from "../components/schoolTransition/NoDataAvailable";
import { SchoolYearTransitionChildrenTableTitle } from "../components/schoolTransition/SchoolYearTransitionChildrenTableTitle";
import { useGroupsRouteParams } from "../hooks/useGroupsRouteParams";
import { DentalDaycareChildrenRouteParams } from "../schemas/DentalDaycareChildrenRouteParams";

const columnHelper = createColumnHelper<ChildForTransition>();
const columns = [
  columnHelper.accessor("lastName", {
    header: "Nachname",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("firstName", {
    header: "Vorname",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("dateOfBirth", {
    header: "Geburtsdatum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: true,
    meta: {
      width: 160,
    },
  }),
  columnHelper.accessor("gender", {
    header: "Geschlecht",
    cell: (props) => {
      const value = props.getValue();
      return isDefined(value) ? GENDER_VALUES[value] : "";
    },
    enableSorting: false,
    meta: {
      width: 140,
    },
  }),
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: true,
  }),
];

const initialSorting: ColumnSort = {
  id: "lastName",
  desc: false,
};

export function SchoolYearTransitionChildrenPage(
  props: DynamicPageProps<DentalDaycareChildrenRouteParams>,
) {
  const { childApi } = useDentalApi();
  const { institutionId } = useGroupsRouteParams(props.params);
  const currentSchoolYear = formatSchoolYear(new Date().getFullYear() - 1);

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting,
  });

  const [{ data: institution }, { data: childrenForTransition, isFetching }] =
    useSuspenseQueries({
      queries: [
        useGetContactQueryOptions(institutionId),
        getChildrenForTransitionQuery(childApi, {
          institutionId,
          sortKey: getSortKey(tableControl.tableSorting, SORT_KEY_MAPPING),
          sortDirection: getSortDirection(tableControl.tableSorting),
        }),
      ],
    });

  const { rowSelection, rowSelectionProps } =
    useRowSelection<ChildForTransition>({
      toggleSelectProps: {
        ariaLabelSelectRow: "Kind auswählen",
        ariaLabelDeselectRow: "Kind abwählen",
        ariaLabelSelectAllRows: "Alle Kinder auswählen",
        ariaLabelDeselectAllRows: "Alle Kinder abwählen",
      },
    });

  const routeBack = routes.children.schoolYearTransition.daycares;
  useSyncRowSelection(rowSelectionProps, childrenForTransition);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Schuljahr ${currentSchoolYear} abschließen - ${institution.name}`}
          backButton={<ToolbarBackButton href={routeBack} />}
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <Stack gap={2} sx={{ height: "inherit" }}>
          <Alert
            color="primary"
            message="Sobald ein Kind für das kommende Schuljahr zugeordnet wurde, wird es automatisch aus der Liste entfernt."
          />
          <TablePage data-testid="childrenTable" fullHeight>
            <TableSheet
              loading={isFetching}
              invertTitleAndContentDomOrder
              title={
                <SchoolYearTransitionChildrenTableTitle
                  rowSelection={rowSelection}
                  allChildren={childrenForTransition}
                  institutionName={institution.name}
                />
              }
              role="group"
              aria-label="Kinder"
            >
              <DataTable
                data={childrenForTransition}
                columns={columns}
                rowSelectionProps={rowSelectionProps}
                sorting={tableControl.tableSorting}
                enableSortingRemoval={false}
                minWidth={600}
                noDataComponent={() => (
                  <NoDataAvailable href={routeBack} data="Kinder" />
                )}
              />
            </TableSheet>
          </TablePage>
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

const SORT_KEY_MAPPING: Record<string, ApiChildForTransitionSortKey> = {
  firstName: ApiChildForTransitionSortKey.FirstName,
  lastName: ApiChildForTransitionSortKey.LastName,
  dateOfBirth: ApiChildForTransitionSortKey.DateOfBirth,
  groupName: ApiChildForTransitionSortKey.GroupName,
};
