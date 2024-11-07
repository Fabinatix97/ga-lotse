/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { doNothing, isPlainObject } from "remeda";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { EvaluationTemplateWithUserInfo } from "@/lib/businessModules/statistics/api/models/evaluationTemplatesOverview";
import { useDeleteEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteEvaluationTemplate";
import { useGetEvaluationTemplatesOverview } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplatesOverview";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useTableSorting } from "@/lib/shared/hooks/table/useTableSorting";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export function EvaluationTemplatesOverview() {
  const userPermissions = useStatisticRoleChecks();
  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();
  const { sortKey, sortDirection, manualSortingProps } = useTableSorting({
    onSortingChange: () => resetPageNumber(),
    initialSorting: {
      id: "createdAt",
      desc: true,
    },
  });

  const evaluationTemplatesOverview = useGetEvaluationTemplatesOverview({
    page,
    pageSize,
    sortDirection,
    sortKey,
  });
  const writePermission = useHasUserRoleCheck(
    ApiUserRole.StatisticsStatisticsWrite,
  );
  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteEvaluationTemplate = useDeleteEvaluationTemplate();

  function deleteTemplateWithConfirmation(templateId: string) {
    openConfirmationDialog({
      title: "Vorlage löschen?",
      description: "Möchten Sie die Vorlage wirklich löschen?",
      confirmLabel: "Löschen",
      onConfirm: () => deleteEvaluationTemplate(templateId),
      color: "danger",
    });
  }

  return (
    <TablePage data-testid="evaluation-templates-overview-table" fullHeight>
      <TableSheet
        footer={
          <Pagination
            {...getPaginationProps({
              totalCount: evaluationTemplatesOverview.totalNumberOfElements,
            })}
          />
        }
      >
        <DataTable
          data={evaluationTemplatesOverview.evaluationTemplates}
          columns={evaluationTemplatesColumns(
            writePermission,
            userPermissions.canWrite,
            userPermissions.canUpdateEvaluationTemplate,
            userPermissions.canDeleteEvaluationTemplate,
            deleteTemplateWithConfirmation,
          )}
          wrapHeader
          wrapContent
          noDataComponent={() => (
            <Box flex={1} alignContent="center">
              <NoSearchResults info="Keine Vorlagen vorhanden" />
              {/* TODO: comment in and open sidebar on click 
              <Button
                size="md"
                startDecorator={<Add />}
                onClick={() => doNothing()}
              >
                Vorlage erstellen
              </Button> */}
            </Box>
          )}
          sorting={manualSortingProps}
        ></DataTable>
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<EvaluationTemplateWithUserInfo>();

function evaluationTemplatesColumns(
  writePermission: boolean,
  canWrite: (creatorUserId: string) => boolean,
  canEdit: (creatorUserId: string) => boolean,
  canDelete: (creatorUserId: string) => boolean,
  onDelete: (id: string) => void,
) {
  const staticColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("businessModuleName", {
      header: "Datenquelle",
      enableSorting: false,
      cell: (props) =>
        businessModuleNames[mapToApiBusinessModule(props.getValue())],
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("analysisCount", {
      header: "Analysen",
      meta: { canNavigate: { parentRow: true }, width: "8rem" },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: (props) => formatDate(props.getValue(), "DE"),
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("user", {
      header: "Erstellt von",
      enableSorting: false,
      cell: (props) => <UserLink user={props.getValue()} />,
      meta: { canNavigate: { parentRow: true } },
    }),
  ];

  if (!writePermission) {
    return staticColumns;
  }

  return [
    ...staticColumns,
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      enableSorting: false,
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            canWrite(props.row.original.userId) && {
              label: "Auswertung erstellen",
              onClick: () => doNothing(),
              startDecorator: <Add />,
            },
            canEdit(props.row.original.userId) && {
              label: "Bearbeiten",
              onClick: () => doNothing(),
              startDecorator: <Edit />,
            },
            canDelete(props.row.original.userId) &&
              ({
                label: "Löschen",
                onClick: () => onDelete(props.row.original.id),
                color: "danger",
                startDecorator: <Delete />,
              } satisfies ActionsItem),
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
