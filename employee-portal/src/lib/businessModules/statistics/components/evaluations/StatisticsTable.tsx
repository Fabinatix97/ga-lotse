/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEvaluationInfo,
  ApiEvaluationState,
  ApiStatisticsFeature,
} from "@eshg/employee-portal-api/statistics";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import {
  Add,
  Delete,
  Download,
  Edit,
  FileCopy,
  Menu,
} from "@mui/icons-material";
import { Box, Button, ColorPaletteProp } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { doNothing, isDefined, isNonNull, isPlainObject } from "remeda";

import {
  StatisticOverview,
  StatisticOverviewTableItem,
} from "@/lib/businessModules/statistics/api/models/statisticOverview";
import { getStatisticsQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { DuplicateStatisticSidebar } from "@/lib/businessModules/statistics/components/evaluations/DuplicateStatisticSidebar/DuplicateStatisticSidebar";
import { SaveAsEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveAsEvaluationTemplateSidebar";
import { StatisticNameChangeModal } from "@/lib/businessModules/statistics/components/evaluations/details/StatisticNameChangeModal";
import {
  ENUM_FALSE_VALUE,
  ENUM_TRUE_VALUE,
  shouldSearchForFalse,
  shouldSearchForTrue,
} from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
import { useDeleteStatisticWithConfirmation } from "@/lib/businessModules/statistics/components/evaluations/useDeleteStatisticWithConfirmation";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { useFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import {
  Pagination,
  PaginationProps,
} from "@/lib/shared/components/pagination/Pagination";
import {
  DataTable,
  ManualSortingProps,
} from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { UserLink } from "@/lib/shared/components/users/UserLink";

import { StateChip } from "./StateChip";

const columnHelper = createColumnHelper<StatisticOverviewTableItem>();

function CreateStatisticsButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="md" startDecorator={<Add />} onClick={onClick}>
      Auswertung erstellen
    </Button>
  );
}

function columns(
  deleteStatisticWithConfirmation: (id: string, statisticsName: string) => void,
  canDelete: (creatorUserId: string) => boolean,
  canWrite: (creatorUserId: string) => boolean,
  canUpdateStatistic: (creatorUserId: string) => boolean,
  onDuplicate: (item: StatisticOverviewTableItem) => void,
  duplicateStatisticEnabled: boolean,
  onNameChange: (id: string, name: string) => void,
  onSaveAsTemplate: (item: StatisticOverviewTableItem) => void,
  exportDataFeatureToggle: boolean,
) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("dataSourceName", {
      header: "Datenquelle",
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "8rem",
      },
    }),
    columnHelper.accessor("timeRangeStart", {
      header: "Zeitraum Start",
      cell: (props) => formatDate(props.getValue(), "DE"),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "10rem",
      },
    }),
    columnHelper.accessor("timeRangeEnd", {
      header: "Zeitraum Ende",
      cell: (props) => formatDate(props.getValue(), "DE"),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "10rem",
      },
    }),
    columnHelper.accessor("user", {
      header: "Erstellt von",
      enableSorting: false,
      cell: (props) => <UserLink user={props.getValue()} />,
    }),
    columnHelper.accessor("state", {
      header: "Status",
      enableSorting: false,
      cell: (props) => <StateChip value={props.getValue()} />,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "8rem",
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      enableSorting: false,
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            canUpdateStatistic(props.row.original.userId) && {
              label: "Name ändern",
              onClick: () =>
                onNameChange(props.row.original.id, props.row.original.name),
              disabled:
                props.row.original.state !== ApiEvaluationState.Completed,
              startDecorator: <Edit />,
            },
            canWrite(props.row.original.userId) &&
              duplicateStatisticEnabled && {
                label: "Duplizieren",
                onClick: () => {
                  onDuplicate(props.row.original);
                },
                disabled:
                  props.row.original.state !== ApiEvaluationState.Completed,
                startDecorator: <FileCopy />,
              },
            props.row.original.anonymized &&
              exportDataFeatureToggle && {
                label: "Daten exportieren",
                onClick: doNothing,
                disabled:
                  props.row.original.state !== ApiEvaluationState.Completed,
                startDecorator: <Download />,
              },
            canWrite(props.row.original.userId) && {
              label: "Als Vorlage speichern",
              onClick: () => {
                onSaveAsTemplate(props.row.original);
              },
              disabled:
                props.row.original.state !== ApiEvaluationState.Completed,
              startDecorator: <Menu />,
            },
            canDelete(props.row.original.userId) && {
              label: "Löschen",
              onClick: () =>
                deleteStatisticWithConfirmation(
                  props.row.original.id,
                  props.row.original.name,
                ),
              disabled:
                props.row.original.state === ApiEvaluationState.CopyOngoing,
              startDecorator: <Delete />,
              color: "danger" as ColorPaletteProp,
            },
          ].filter(isPlainObject)}
        />
      ),
      meta: {
        width: "6rem",
        cellStyle: "button",
      },
    }),
  ];
}

export interface StatisticsTableProps {
  statisticOverview: StatisticOverview;
  loading: boolean;
  onCreateStatisticClick: () => void;
  onAnonymizedFilterChanged: (filter: boolean | undefined) => void;
  manualSortingProps: ManualSortingProps;
  paginationProps: PaginationProps;
}

export function StatisticsTable({
  statisticOverview,
  loading,
  onCreateStatisticClick,
  onAnonymizedFilterChanged,
  manualSortingProps,
  paginationProps,
}: StatisticsTableProps) {
  const duplicateStatisticEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.CloneStatistic,
  );
  const fakeAnonymizationEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.FakeAnonymization,
  );

  const [duplicateStatisticAction, setDuplicateStatisticAction] =
    useState<StatisticOverviewTableItem>();
  const [nameChangeAction, setNameChangeAction] =
    useState<Pick<ApiEvaluationInfo, "id" | "name">>();
  const [
    saveAsEvaluationTemplateSidebarEvaluationId,
    setSaveAsEvaluationTemplateSidebarEvaluationId,
  ] = useState<string | null>(null);

  const userPermissions = useStatisticRoleChecks();

  const deleteStatisticsWithConfirmation = useDeleteStatisticWithConfirmation();

  const filterSettings = useFilterSettings({
    definitions: statisticsOverviewFilterDefinitions,
    onValuesSubmit: (filterValues) => {
      onAnonymizedFilterChanged(
        mapFilterValuesToAnonymizationFilter(filterValues),
      );
    },
    showSearch: false,
  });

  return (
    <>
      <TablePage
        data-testid="statistics-table"
        fullHeight
        controls={
          <ButtonBar
            left={
              fakeAnonymizationEnabled ? (
                <FilterButton {...filterSettings.filterButtonProps} />
              ) : undefined
            }
            right={[
              <RefreshButton
                key="refreshStatistic"
                loading={loading}
                queryKey={getStatisticsQueryKey([])}
              />,
              <InternalLinkButton
                key="evaluationTemplatesOverview"
                variant="outlined"
                href={routes.evaluations.templates.index}
              >
                Auswertungsvorlagen
              </InternalLinkButton>,
              userPermissions.canWrite() && (
                <CreateStatisticsButton
                  key="createStatistic"
                  onClick={onCreateStatisticClick}
                />
              ),
            ]}
          />
        }
        filterSettings={
          filterSettings.filterSettingsVisible && (
            <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
              <FilterSettings {...filterSettings.filterSettingsProps} />
            </FilterSettingsSheet>
          )
        }
      >
        <TableSheet footer={<Pagination {...paginationProps} />}>
          <DataTable
            wrapContent
            minWidth="58rem"
            data={statisticOverview.data}
            columns={columns(
              deleteStatisticsWithConfirmation,
              userPermissions.canDelete,
              userPermissions.canWrite,
              userPermissions.canUpdateStatistic,
              setDuplicateStatisticAction,
              duplicateStatisticEnabled,
              (id, name) => setNameChangeAction({ id, name }),
              (item) => setSaveAsEvaluationTemplateSidebarEvaluationId(item.id),
              fakeAnonymizationEnabled,
            )}
            sorting={manualSortingProps}
            rowNavigation={{
              route: (row) =>
                row.original.state === ApiEvaluationState.Completed
                  ? routes.evaluations.details(row.original.id).index
                  : undefined,
              focusColumnAccessorKey: "name",
            }}
            enableSortingRemoval={false}
            noDataComponent={() => (
              <Box flex={1} alignContent="center">
                <NoSearchResults
                  info="Keine Auswertungen vorhanden"
                  buttonLabel="Auswertung erstellen"
                  onClick={onCreateStatisticClick}
                  decorator={<Add />}
                />
              </Box>
            )}
          />
        </TableSheet>
      </TablePage>

      {isDefined(duplicateStatisticAction) && (
        <OverlayBoundary>
          <DuplicateStatisticSidebar
            onClose={() => setDuplicateStatisticAction(undefined)}
            originalStatistic={duplicateStatisticAction}
          />
        </OverlayBoundary>
      )}
      {isNonNull(saveAsEvaluationTemplateSidebarEvaluationId) && (
        <OverlayBoundary>
          <SaveAsEvaluationTemplateSidebar
            open={true}
            onClose={() => setSaveAsEvaluationTemplateSidebarEvaluationId(null)}
            evaluationId={saveAsEvaluationTemplateSidebarEvaluationId}
          />
        </OverlayBoundary>
      )}

      {isDefined(nameChangeAction) && (
        <OverlayBoundary>
          <StatisticNameChangeModal
            open={true}
            onClose={() => setNameChangeAction(undefined)}
            initialName={nameChangeAction.name}
            statisticId={nameChangeAction.id}
          />
        </OverlayBoundary>
      )}
    </>
  );
}

const statisticsOverviewFilterDefinitions = [
  {
    type: "Enum",
    key: "anonymizationValue",
    name: "Anonymisierte Daten",
    options: [
      { label: "Ja", value: ENUM_TRUE_VALUE },
      { label: "Nein", value: ENUM_FALSE_VALUE },
    ],
  },
] satisfies FilterDefinition[];

function mapFilterValuesToAnonymizationFilter(
  filterValues: FilterValue[],
): boolean | undefined {
  const selectedValues =
    (
      filterValues.find(
        (filterValue) =>
          filterValue.key === "anonymizationValue" &&
          filterValue.type === "Enum",
      ) as EnumFilterValue
    )?.selectedValues ?? [];

  const searchForTrue = shouldSearchForTrue(selectedValues);
  const searchForFalse = shouldSearchForFalse(selectedValues);
  if (searchForTrue && searchForFalse) {
    return undefined;
  }
  if (searchForTrue) {
    return true;
  }
  if (searchForFalse) {
    return false;
  }
}
