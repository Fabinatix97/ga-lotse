/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add, CloudUpload, Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { isPlainObject } from "remeda";

import { EvaluationTemplateWithUserInfo } from "@/lib/businessModules/statistics/api/models/evaluationTemplatesOverview";
import { useDeleteEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteEvaluationTemplate";
import { useGetEvaluationTemplatesOverview } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplatesOverview";
import { UpdateEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/UpdateEvaluationTemplateSidebar";
import { CreateEvaluationFromTemplateSidebarStepper } from "@/lib/businessModules/statistics/components/evaluations/templates/CreateEvaluationFromTemplateSidebar/CreateEvaluationFromTemplateSidebarStepper";
import { useEvaluationTemplateDetailsSidebar } from "@/lib/businessModules/statistics/components/evaluations/templates/EvaluationTemplateDetailsSidebar";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticsRoleChecks";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useTableSorting } from "@/lib/shared/hooks/table/useTableSorting";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { UploadTemplateSidebarStepper } from "./UploadTemplateSidebar/UploadTemplateSidebarStepper";

export function EvaluationTemplatesOverview() {
  const userPermissions = useStatisticsRoleChecks();
  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();
  const { sortKey, sortDirection, manualSortingProps } = useTableSorting({
    onSortingChange: () => resetPageNumber(),
    initialSorting: {
      id: "createdAt",
      desc: true,
    },
  });
  const [
    onCreateSelectedEvaluationTemplateId,
    setOnCreateSelectedEvaluationTemplateId,
  ] = useState<string | null>(null);
  const [
    onEditSelectedEvaluationTemplateId,
    setOnEditSelectedEvaluationTemplateId,
  ] = useState<string | null>(null);
  const [onUploadSelectedTemplateId, setOnUploadSelectedTemplateId] = useState<
    string | null
  >(null);

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
  const evaluationTemplateDetailsSidebar =
    useEvaluationTemplateDetailsSidebar();

  function deleteTemplateWithConfirmation(
    templateId: string,
    templateName: string,
  ) {
    openConfirmationDialog({
      title: "Vorlage löschen?",
      description: `Die Vorlage „${templateName}” wird dann unwiderruflich gelöscht.`,
      confirmLabel: "Löschen",
      onConfirm: () => deleteEvaluationTemplate(templateId),
      color: "danger",
    });
  }

  function openTemplateDetails(templateId: string) {
    evaluationTemplateDetailsSidebar.open({
      evaluationTemplateId: templateId,
      onEditEvaluationTemplate: () => {
        setOnEditSelectedEvaluationTemplateId(templateId);
      },
      onCreateEvaluation: () => {
        setOnCreateSelectedEvaluationTemplateId(templateId);
      },
      onUploadEvaluation: () => {
        setOnUploadSelectedTemplateId(templateId);
      },
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
        <>
          {onEditSelectedEvaluationTemplateId && (
            <OverlayBoundary>
              <UpdateEvaluationTemplateSidebar
                evaluationTemplateId={onEditSelectedEvaluationTemplateId}
                onClose={() => setOnEditSelectedEvaluationTemplateId(null)}
              />
            </OverlayBoundary>
          )}
          {onCreateSelectedEvaluationTemplateId && (
            <OverlayBoundary>
              <CreateEvaluationFromTemplateSidebarStepper
                evaluationTemplateId={onCreateSelectedEvaluationTemplateId}
                onClose={() => setOnCreateSelectedEvaluationTemplateId(null)}
              />
            </OverlayBoundary>
          )}
          {onUploadSelectedTemplateId && (
            <OverlayBoundary>
              <UploadTemplateSidebarStepper
                templateId={onUploadSelectedTemplateId}
                onClose={() => setOnUploadSelectedTemplateId(null)}
              />
            </OverlayBoundary>
          )}

          <DataTable
            data={evaluationTemplatesOverview.evaluationTemplates}
            columns={evaluationTemplatesColumns(
              writePermission,
              userPermissions.canWrite,
              userPermissions.canUpdateEvaluationTemplate,
              userPermissions.canDeleteEvaluationTemplate,
              deleteTemplateWithConfirmation,
              setOnEditSelectedEvaluationTemplateId,
              setOnCreateSelectedEvaluationTemplateId,
              setOnUploadSelectedTemplateId,
            )}
            wrapHeader
            wrapContent
            noDataComponent={() => (
              <Box flex={1} alignContent="center">
                <NoSearchResults info="Keine Vorlagen vorhanden" />
              </Box>
            )}
            sorting={manualSortingProps}
            rowNavigation={{
              focusColumnAccessorKey: "name",
              onClick: (row) => openTemplateDetails(row.original.id),
            }}
          />
        </>
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
  onDelete: (id: string, name: string) => void,
  onEdit: (id: string) => void,
  onCreateEvaluation: (id: string) => void,
  onUploadEvaluationTemplate: (id: string) => void,
) {
  const staticColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("dataSourceName", {
      header: "Datenquelle",
      enableSorting: false,
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("analysisCount", {
      header: "Analysen",
      meta: { canNavigate: { parentRow: true }, width: "8rem" },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: (props) => formatDate(props.getValue()),
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("user", {
      header: "Erstellt von",
      enableSorting: false,
      cell: (props) => <UserLink user={props.getValue()} />,
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
              onClick: () => onCreateEvaluation(props.row.original.id),
              startDecorator: <Add />,
            },
            canEdit(props.row.original.userId) && {
              label: "Bearbeiten",
              onClick: () => onEdit(props.row.original.id),
              startDecorator: <Edit />,
            },
            canWrite(props.row.original.userId) && {
              label: "Hochladen",
              onClick: () => onUploadEvaluationTemplate(props.row.original.id),
              startDecorator: <CloudUpload />,
            },
            canDelete(props.row.original.userId) &&
              ({
                label: "Löschen",
                onClick: () =>
                  onDelete(props.row.original.id, props.row.original.name),
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
