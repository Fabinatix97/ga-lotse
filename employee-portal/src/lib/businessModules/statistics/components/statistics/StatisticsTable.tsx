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
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { isDefined } from "remeda";

import { useDeleteStatistic } from "@/lib/businessModules/statistics/api/mutations/useDeleteStatistic";
import { getStatisticsQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { DuplicateStatisticSidebar } from "@/lib/businessModules/statistics/components/statistics/DuplicateStatisticSidebar/DuplicateStatisticSidebar";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
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
      Statistik erstellen
    </Button>
  );
}

function columns(
  deleteStatisticWithConfirmation: (id: string, statisticsName: string) => void,
  canDelete: (creatorUserId: string) => boolean,
  canWrite: (creatorUserId: string) => boolean,
  onDuplicate: (item: StatisticWithUserInfo) => void,
  duplicateStatisticEnabled: boolean,
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
            ...(canWrite(props.row.original.userId) &&
            duplicateStatisticEnabled &&
            props.row.original.state === ApiStatisticState.Completed
              ? [
                  {
                    label: "Duplizieren",
                    onClick: () => {
                      onDuplicate(props.row.original);
                    },
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
  });
  const deleteStatistic = useDeleteStatistic();
  const { openConfirmationDialog } = useConfirmationDialog();
  const duplicateStatisticEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.CloneStatistic,
  );
  const [duplicateStatisticAction, setDuplicateStatisticAction] =
    useState<StatisticWithUserInfo>();

  const userPermissions = useStatisticRoleChecks();

  const tableData: StatisticWithUserInfo[] = data.statistics.map(
    (statistic) => ({
      ...statistic,
      user: data.resolvedUsers[statistic.userId],
    }),
  );

  function deleteStatisticsWithConfirmation(
    statisticId: string,
    statisticsName: string,
  ) {
    openConfirmationDialog({
      title: "Statistik Löschen?",
      description: `Die Statistik "${statisticsName}" wird dann unwiderruflich gelöscht.`,
      confirmLabel: "Löschen",
      onConfirm: () => deleteStatistic(statisticId),
      color: "danger",
    });
  }

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
              userPermissions.canDeleteStatistic,
              userPermissions.canWrite,
              setDuplicateStatisticAction,
              duplicateStatisticEnabled,
            )}
            sorting={tableControl.tableSorting}
            rowNavRoute={(row) =>
              row.original.state === ApiStatisticState.Completed
                ? routes.statistics.details(row.original.id).index
                : undefined
            }
            focusColumnHeader="Name"
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
    </>
  );
}
