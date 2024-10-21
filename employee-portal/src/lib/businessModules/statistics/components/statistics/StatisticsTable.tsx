/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetStatisticsResponse,
  ApiStatisticInfo,
  ApiStatisticState,
  ApiStatisticsFeature,
  ApiUser,
} from "@eshg/employee-portal-api/statistics";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Box, Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { isDefined } from "remeda";

import { getStatisticsQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { DuplicateStatisticSidebar } from "@/lib/businessModules/statistics/components/statistics/DuplicateStatisticSidebar/DuplicateStatisticSidebar";
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

type StatisticWithUserInfo = ApiStatisticInfo & {
  user: ApiUser | undefined;
};

const columnHelper = createColumnHelper<StatisticWithUserInfo>();

function TemplatesButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outlined" size="md" onClick={onClick}>
      Vorlagen
    </Button>
  );
}

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
  onDuplicate: (item: StatisticWithUserInfo) => void,
  duplicateStatisticEnabled: boolean,
  onNameChange: (id: string, name: string) => void,
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
            {
              label: "Anzeigen",
              onClick: routes.statistics.details(props.row.original.id).index,
              disabled:
                props.row.original.state !== ApiStatisticState.Completed,
              startDecorator: <FullscreenIcon />,
            },
            ...(canUpdateStatistic(props.row.original.userId)
              ? [
                  {
                    label: "Name ändern",
                    onClick: () =>
                      onNameChange(
                        props.row.original.id,
                        props.row.original.name,
                      ),
                    disabled:
                      props.row.original.state !== ApiStatisticState.Completed,
                    startDecorator: <Edit />,
                  },
                ]
              : []),
            ...(canWrite(props.row.original.userId) && duplicateStatisticEnabled
              ? [
                  {
                    label: "Duplizieren",
                    onClick: () => {
                      onDuplicate(props.row.original);
                    },
                    disabled:
                      props.row.original.state !== ApiStatisticState.Completed,
                    startDecorator: <FileCopyIcon />,
                  },
                ]
              : []),
            ...(canDelete(props.row.original.userId)
              ? [
                  {
                    label: "Löschen",
                    onClick: () =>
                      deleteStatisticWithConfirmation(
                        props.row.original.id,
                        props.row.original.name,
                      ),
                    disabled:
                      props.row.original.state ===
                      ApiStatisticState.CopyOngoing,
                    startDecorator: <DeleteIcon />,
                  },
                ]
              : []),
          ]}
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
  data: ApiGetStatisticsResponse;
  loading: boolean;
  onTemplateClick: () => void;
  onCreateStatisticClick: () => void;
}

export function StatisticsTable({
  data,
  loading,
  onTemplateClick,
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
  const [duplicateStatisticAction, setDuplicateStatisticAction] =
    useState<StatisticWithUserInfo>();
  const [nameChangeAction, setNameChangeAction] =
    useState<Pick<ApiStatisticInfo, "id" | "name">>();

  const userPermissions = useStatisticRoleChecks();

  const tableData: StatisticWithUserInfo[] = data.statistics.map(
    (statistic) => ({
      ...statistic,
      user: data.resolvedUsers[statistic.userId],
    }),
  );

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
              userPermissions.canWrite() && (
                <TemplatesButton
                  key="displayTemplates"
                  onClick={onTemplateClick}
                />
              ),
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
              totalCount={data.totalNumberOfElements}
              {...tableControl.paginationProps}
            />
          }
        >
          <DataTable
            wrapContent
            minWidth="58rem"
            data={tableData}
            columns={columns(
              deleteStatisticsWithConfirmation,
              userPermissions.canDelete,
              userPermissions.canWrite,
              userPermissions.canUpdateStatistic,
              setDuplicateStatisticAction,
              duplicateStatisticEnabled,
              (id, name) => setNameChangeAction({ id, name }),
            )}
            sorting={tableControl.tableSorting}
            rowNavRoute={(row) =>
              row.original.state === ApiStatisticState.Completed
                ? routes.statistics.details(row.original.id).index
                : undefined
            }
            focusColumnHeader="Name"
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
