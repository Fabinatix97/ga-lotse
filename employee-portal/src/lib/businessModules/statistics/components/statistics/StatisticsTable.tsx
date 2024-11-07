/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiStatisticInfo,
  ApiStatisticState,
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
import { DuplicateStatisticSidebar } from "@/lib/businessModules/statistics/components/statistics/DuplicateStatisticSidebar/DuplicateStatisticSidebar";
import { SaveAsEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/statistics/SaveAsEvaluationTemplateSidebar/SaveAsEvaluationTemplateSidebar";
import { StatisticNameChangeModal } from "@/lib/businessModules/statistics/components/statistics/details/StatisticNameChangeModal";
import { useDeleteStatisticWithConfirmation } from "@/lib/businessModules/statistics/components/statistics/useDeleteStatisticWithConfirmation";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

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
                props.row.original.state !== ApiStatisticState.Completed,
              startDecorator: <Edit />,
            },
            canWrite(props.row.original.userId) &&
              duplicateStatisticEnabled && {
                label: "Duplizieren",
                onClick: () => {
                  onDuplicate(props.row.original);
                },
                disabled:
                  props.row.original.state !== ApiStatisticState.Completed,
                startDecorator: <FileCopy />,
              },
            props.row.original.anonymized &&
              exportDataFeatureToggle && {
                label: "Daten exportieren",
                onClick: doNothing,
                disabled:
                  props.row.original.state !== ApiStatisticState.Completed,
                startDecorator: <Download />,
              },
            canWrite(props.row.original.userId) && {
              label: "Als Vorlage speichern",
              onClick: () => {
                onSaveAsTemplate(props.row.original);
              },
              disabled:
                props.row.original.state !== ApiStatisticState.Completed,
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
                props.row.original.state === ApiStatisticState.CopyOngoing,
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
}

export function StatisticsTable({
  statisticOverview,
  loading,

  onCreateStatisticClick,
}: StatisticsTableProps) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    initialSorting: {
      id: "timeRangeStart",
      desc: true,
    },
  });
  const duplicateStatisticEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.CloneStatistic,
  );
  const exportDataFeatureToggle = useIsNewFeatureEnabled(
    ApiStatisticsFeature.FakeAnonymization,
  );

  const [duplicateStatisticAction, setDuplicateStatisticAction] =
    useState<StatisticOverviewTableItem>();
  const [nameChangeAction, setNameChangeAction] =
    useState<Pick<ApiStatisticInfo, "id" | "name">>();
  const [
    saveAsEvaluationTemplateSidebarEvaluationId,
    setSaveAsEvaluationTemplateSidebarEvaluationId,
  ] = useState<string | null>(null);

  const userPermissions = useStatisticRoleChecks();

  const deleteStatisticsWithConfirmation = useDeleteStatisticWithConfirmation();

  return (
    <>
      <TablePage
        data-testid="statistics-table"
        fullHeight
        controls={
          <ButtonBar
            right={[
              <RefreshButton
                key="refreshStatistic"
                loading={loading}
                queryKey={getStatisticsQueryKey([])}
              />,
              <InternalLinkButton
                key="evaluationTemplatesOverview"
                variant="outlined"
                href={routes.statistics.evaluationTemplates.index}
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
      >
        <TableSheet
          footer={
            <Pagination
              totalCount={statisticOverview.totalNumberOfElements}
              {...tableControl.paginationProps}
            />
          }
        >
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
              exportDataFeatureToggle,
            )}
            sorting={tableControl.tableSorting}
            rowNavigation={{
              route: (row) =>
                row.original.state === ApiStatisticState.Completed
                  ? routes.statistics.details(row.original.id).index
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
