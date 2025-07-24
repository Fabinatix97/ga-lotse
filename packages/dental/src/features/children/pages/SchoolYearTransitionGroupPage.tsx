/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import {
  DataTable,
  MainContentLayout,
  StickyToolbarLayout,
  TablePage,
  TableSheet,
  Toolbar,
  ToolbarBackButton,
  formatSchoolYear,
  useGetContactQueryOptions,
  useRowSelection,
  useSyncRowSelection,
} from "@eshg/lib-employee-portal";
import { Alert, DynamicPageProps } from "@eshg/lib-portal";

import { routes } from "../../../config/routes";
import { useDentalApi } from "../../../contexts/dental";
import { GroupsForTransition } from "../api/models/SchoolYearTransitionGroupResult";
import { getGroupsForTransitionQuery } from "../api/queries/schoolYearTransition";
import { NoDataAvailable } from "../components/schoolTransition/NoDataAvailable";
import { SchoolYearTransitionGroupsTableTitle } from "../components/schoolTransition/SchoolYearTransitionGroupsTableTitle";
import { useGroupsRouteParams } from "../hooks/useGroupsRouteParams";
import { DentalGroupsRouteParams } from "../schemas/DentalGroupsRouteParams";

const columnHelper = createColumnHelper<GroupsForTransition>();
const columns = [
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 230,
    },
  }),
  columnHelper.accessor("children", {
    header: "Kinder",
    cell: (props) => props.getValue().length,
    enableSorting: false,
  }),
];

export function SchoolYearTransitionGroupPage(
  props: DynamicPageProps<DentalGroupsRouteParams>,
) {
  const { childApi } = useDentalApi();
  const { institutionId } = useGroupsRouteParams(props.params);
  const currentSchoolYear = formatSchoolYear(new Date().getFullYear() - 1);
  const [{ data: institution }, { data: groupsForTransition, isFetching }] =
    useSuspenseQueries({
      queries: [
        useGetContactQueryOptions(institutionId),
        getGroupsForTransitionQuery(childApi, institutionId),
      ],
    });
  const { rowSelection, rowSelectionProps } =
    useRowSelection<GroupsForTransition>({
      toggleSelectProps: {
        ariaLabelSelectRow: "Gruppe auswählen",
        ariaLabelDeselectRow: "Gruppe abwählen",
        ariaLabelSelectAllRows: "Alle Gruppen auswählen",
        ariaLabelDeselectAllRows: "Alle Gruppen abwählen",
      },
    });

  const routeBack = routes.children.schoolYearTransition.schools;
  useSyncRowSelection(rowSelectionProps, groupsForTransition);

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
            message="Sobald eine Gruppe für das kommende Schuljahr zugeordnet wurde, wird sie automatisch aus der Liste entfernt."
          />
          <TablePage data-testid="groupsTable" fullHeight>
            <TableSheet
              loading={isFetching}
              title={
                <SchoolYearTransitionGroupsTableTitle
                  rowSelection={rowSelection}
                  institutionId={institutionId}
                  institutionName={institution.name}
                />
              }
            >
              <DataTable
                data={groupsForTransition}
                columns={columns}
                rowSelectionProps={rowSelectionProps}
                enableSortingRemoval={false}
                minWidth={600}
                noDataComponent={() => (
                  <NoDataAvailable href={routeBack} data="Gruppen" />
                )}
              />
            </TableSheet>
          </TablePage>
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
