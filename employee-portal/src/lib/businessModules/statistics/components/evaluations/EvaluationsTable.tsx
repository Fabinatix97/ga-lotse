/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  DataTable,
  ManualTableSortingProps,
  OverlayBoundary,
  Pagination,
  PaginationProps,
  TablePage,
  TableSheet,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiAvailableDataSource,
  ApiEvaluationInfo,
  ApiEvaluationState,
} from "@eshg/statistics-api";
import {
  Add,
  Delete,
  Download,
  Edit,
  FileCopy,
  Menu,
  Share,
} from "@mui/icons-material";
import { Box, Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { isDefined, isPlainObject } from "remeda";

import { useExportEvaluationData } from "@/lib/businessModules/statistics/api/downloads/useExportEvaluationData";
import {
  DataSourceSensitivity,
  translateDataSourceSensitivity,
} from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import {
  EvaluationOverview,
  EvaluationOverviewTableItem,
} from "@/lib/businessModules/statistics/api/models/evaluationOverview";
import { getEvaluationsQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { useDuplicateEvaluationSidebar } from "@/lib/businessModules/statistics/components/evaluations/DuplicateEvaluationSidebar/DuplicateEvaluationSidebar";
import { useSaveAsEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveAsEvaluationTemplateSidebar";
import { EvaluationNameChangeModal } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationNameChangeModal";
import { createFilterDefinitions } from "@/lib/businessModules/statistics/components/evaluations/filterDefinitions";
import { useDeleteEvaluationWithConfirmation } from "@/lib/businessModules/statistics/components/evaluations/useDeleteEvaluationWithConfirmation";
import { getSharedURL } from "@/lib/businessModules/statistics/components/shared/getSharedURL";
import { useDataExportGuard } from "@/lib/businessModules/statistics/components/shared/hooks/useDataExportGuard";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { useFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { useCopy } from "@/lib/shared/hooks/useCopy";

import { StateChip } from "./StateChip";

const columnHelper = createColumnHelper<EvaluationOverviewTableItem>();

function CreateEvaluationsButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="md" startDecorator={<Add />} onClick={onClick}>
      Auswertung erstellen
    </Button>
  );
}

function columns(functions: {
  onShareClicked: (id: string) => Promise<void>;
  deleteEvaluationWithConfirmation: (
    id: string,
    evaluationName: string,
  ) => void;
  canDelete: (creatorUserId: string) => boolean;
  canWrite: (creatorUserId: string) => boolean;
  canUpdateEvaluation: (creatorUserId: string) => boolean;
  onDuplicate: (item: EvaluationOverviewTableItem) => void;
  onNameChange: (id: string, name: string) => void;
  onSaveAsTemplate: (item: EvaluationOverviewTableItem) => void;
  onExportData: (item: EvaluationOverviewTableItem) => Promise<void>;
}) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "10rem",
      },
    }),
    columnHelper.accessor("dataSourceName", {
      header: "Datenquelle",
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "10rem",
      },
    }),
    columnHelper.accessor("dataSourceSensitivity", {
      header: "Sensibilität",
      cell: (props) => translateDataSourceSensitivity(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "8rem",
      },
      enableSorting: false,
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: (props) => formatDate(props.getValue(), "DE"),
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
        width: "8rem",
      },
    }),
    columnHelper.accessor("timeRangeEnd", {
      header: "Zeitraum Ende",
      cell: (props) => formatDate(props.getValue(), "DE"),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "8rem",
      },
    }),
    columnHelper.accessor("user", {
      header: "Erstellt von",
      enableSorting: false,
      cell: (props) => <UserLink user={props.getValue()} />,
      meta: {
        width: "10rem",
      },
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
            {
              label: "Teilen",
              onClick: async () =>
                await functions.onShareClicked(
                  getSharedURL({
                    detailLinkId: props.row.original.id,
                    statisticsSubRoute: "evaluations",
                  }),
                ),
              startDecorator: <Share />,
            },
            functions.canUpdateEvaluation(props.row.original.userId) && {
              label: "Name ändern",
              onClick: () =>
                functions.onNameChange(
                  props.row.original.id,
                  props.row.original.name,
                ),
              disabled:
                props.row.original.state !== ApiEvaluationState.Completed,
              startDecorator: <Edit />,
            },
            functions.canWrite(props.row.original.userId) && {
              label: "Duplizieren",
              onClick: () => {
                functions.onDuplicate(props.row.original);
              },
              disabled:
                props.row.original.state !== ApiEvaluationState.Completed,
              startDecorator: <FileCopy />,
            },
            functions.canWrite(props.row.original.userId) && {
              label: "Als Vorlage speichern",
              onClick: () => {
                functions.onSaveAsTemplate(props.row.original);
              },
              disabled:
                props.row.original.state !== ApiEvaluationState.Completed,
              startDecorator: <Menu />,
            },
            (props.row.original.dataSourceSensitivity ===
              DataSourceSensitivity.Anonymous ||
              props.row.original.dataSourceSensitivity ===
                DataSourceSensitivity.InternalUsage) && {
              label: "Daten exportieren",
              onClick: () => functions.onExportData(props.row.original),
              disabled:
                props.row.original.state !== ApiEvaluationState.Completed,
              startDecorator: <Download />,
            },
            functions.canDelete(props.row.original.userId) &&
              ({
                label: "Löschen",
                onClick: () =>
                  functions.deleteEvaluationWithConfirmation(
                    props.row.original.id,
                    props.row.original.name,
                  ),
                disabled:
                  props.row.original.state === ApiEvaluationState.CopyOngoing,
                startDecorator: <Delete />,
                color: "danger",
              } as const),
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

export interface EvaluationsTableProps {
  apiDataSources: ApiAvailableDataSource[];
  evaluationOverview: EvaluationOverview;
  loading: boolean;
  onCreateEvaluationClick: () => void;
  onFilterValuesChanged: (filterValues: FilterValue[]) => void;
  manualSortingProps: ManualTableSortingProps;
  paginationProps: PaginationProps;
}

export function EvaluationsTable({
  apiDataSources,
  evaluationOverview,
  loading,
  onCreateEvaluationClick,
  onFilterValuesChanged,
  manualSortingProps,
  paginationProps,
}: EvaluationsTableProps) {
  const duplicateEvaluationSidebar = useDuplicateEvaluationSidebar();
  const [nameChangeAction, setNameChangeAction] =
    useState<Pick<ApiEvaluationInfo, "id" | "name">>();
  const saveAsEvaluationTemplateSidebar = useSaveAsEvaluationTemplateSidebar();

  const userPermissions = useStatisticsRoleChecks();

  const deleteEvaluationWithConfirmation =
    useDeleteEvaluationWithConfirmation();

  const { download: exportData } = useExportEvaluationData();
  const dataExportGuard = useDataExportGuard();

  const filterSettings = useFilterSettings({
    definitions: createFilterDefinitions(apiDataSources),
    onValuesSubmit: onFilterValuesChanged,
    showSearch: false,
  });

  const copy = useCopy();

  function openDuplicateEvaluationSidebar(item: EvaluationOverviewTableItem) {
    duplicateEvaluationSidebar.open({ originalEvaluation: item });
  }

  function openSaveAsEvaluationTemplateSidebar(evaluationId: string) {
    saveAsEvaluationTemplateSidebar.open({ evaluationId });
  }

  return (
    <>
      <TablePage
        data-testid="evaluations-table"
        fullHeight
        controls={
          <ButtonBar
            left={<FilterButton {...filterSettings.filterButtonProps} />}
            right={[
              <RefreshButton
                key="refreshEvaluation"
                loading={loading}
                queryKey={getEvaluationsQueryKey([])}
              />,
              <InternalLinkButton
                key="evaluationTemplatesOverview"
                variant="outlined"
                href={routes.evaluations.templates.index}
              >
                Auswertungsvorlagen
              </InternalLinkButton>,
              userPermissions.canWrite() && (
                <CreateEvaluationsButton
                  key="createEvaluation"
                  onClick={onCreateEvaluationClick}
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
            data={evaluationOverview.data}
            columns={columns({
              deleteEvaluationWithConfirmation:
                deleteEvaluationWithConfirmation,
              canDelete: userPermissions.canDelete,
              canWrite: userPermissions.canWrite,
              canUpdateEvaluation: userPermissions.canUpdateEvaluation,
              onDuplicate: openDuplicateEvaluationSidebar,
              onShareClicked: copy,
              onNameChange: (id, name) => setNameChangeAction({ id, name }),
              onSaveAsTemplate: (item) =>
                openSaveAsEvaluationTemplateSidebar(item.id),
              onExportData: async ({
                id,
                tooMuchDataForExport,
                dataSourceSensitivity,
              }) =>
                dataExportGuard(dataSourceSensitivity, () =>
                  exportData({ evaluationId: id }, { tooMuchDataForExport }),
                ),
            })}
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
                  onClick={onCreateEvaluationClick}
                  decorator={<Add />}
                />
              </Box>
            )}
          />
        </TableSheet>
      </TablePage>

      {isDefined(nameChangeAction) && (
        <OverlayBoundary>
          <EvaluationNameChangeModal
            open={true}
            onClose={() => setNameChangeAction(undefined)}
            initialName={nameChangeAction.name}
            evaluationId={nameChangeAction.id}
          />
        </OverlayBoundary>
      )}
    </>
  );
}
