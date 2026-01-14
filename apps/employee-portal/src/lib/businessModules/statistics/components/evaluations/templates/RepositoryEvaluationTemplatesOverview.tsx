/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CloudDownload, Delete } from "@mui/icons-material";
import { Box, List, ListItem } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import {
  ActionsItem,
  ActionsMenu,
  DataTable,
  NoSearchResults,
  TablePage,
  TableSheet,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal";

import { EvaluationTemplateFromRepository } from "@/lib/businessModules/statistics/api/models/evaluationTemplatesOverview";
import { useDeleteRepositoryEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteRepositoryEvaluationTemplate";
import { useGetEvaluationTemplatesFromRepository } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplatesFromRepository";

import { useRepositoryEvaluationTemplateDetailsSidebar } from "./RepositoryEvaluationTemplateDetailsSidebar";

export function RepositoryEvaluationTemplatesOverview() {
  const evaluationTemplates = useGetEvaluationTemplatesFromRepository();
  const repositoryEvaluationTemplateDetailsSidebar =
    useRepositoryEvaluationTemplateDetailsSidebar();

  function openTemplateDetails(templateId: string, templateVersion: number) {
    repositoryEvaluationTemplateDetailsSidebar.open({
      evaluationTemplateId: parseInt(templateId),
      evaluationTemplateVersion: templateVersion,
    });
  }

  const deleteEvaluationTemplate = useDeleteRepositoryEvaluationTemplate();
  const { openConfirmationDialog } = useConfirmationDialog();

  function deleteTemplateWithConfirmation(
    templateId: number,
    templateVersion: number,
  ) {
    openConfirmationDialog({
      title: "Vorlage löschen?",
      description: "Wenn Sie mit dem Löschen fortfahren, wird ...",
      children: (
        <List marker="disc">
          <ListItem>die Auswertungsvorlage unwiderruflich gelöscht,</ListItem>
          <ListItem>
            die Auswertungsvorlage aus den zentralen Diensten entfernt.
          </ListItem>
        </List>
      ),
      confirmLabel: "Löschen",
      onConfirm: () => deleteEvaluationTemplate(templateId, templateVersion),
      color: "danger",
    });
  }

  return (
    <TablePage
      data-testid="repository-evaluation-templates-overview-table"
      fullHeight
    >
      <TableSheet>
        <DataTable
          data={evaluationTemplates}
          columns={evaluationTemplatesColumns(
            openTemplateDetails,
            deleteTemplateWithConfirmation,
          )}
          wrapHeader
          wrapContent
          noDataComponent={() => (
            <Box flex={1} alignContent="center">
              <NoSearchResults info="Keine Vorlagen vorhanden" />
            </Box>
          )}
          sorting={{
            manualSorting: false,
            initialSorting: [
              {
                id: "createdAt",
                desc: true,
              },
            ],
          }}
          rowNavigation={{
            focusColumnAccessorKey: "name",
            onClick: (row) => () =>
              openTemplateDetails(row.original.id, row.original.version),
          }}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<EvaluationTemplateFromRepository>();

function evaluationTemplatesColumns(
  openTemplateDetails: (id: string, version: number) => void,
  deleteEvaluationTemplate: (id: number, version: number) => void,
) {
  const staticColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("dataSourceName", {
      header: "Datenquelle",
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: (props) => formatDate(props.getValue()),
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("origin", {
      header: "Herkunft",
      meta: { canNavigate: { parentRow: true } },
    }),
  ];

  return [
    ...staticColumns,
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      enableSorting: false,
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Herunterladen",
              onClick: () =>
                openTemplateDetails(
                  props.row.original.id,
                  props.row.original.version,
                ),
              startDecorator: <CloudDownload />,
            },
            {
              label: "Löschen",
              onClick: () =>
                deleteEvaluationTemplate(
                  parseInt(props.row.original.id),
                  props.row.original.version,
                ),
              color: "danger",
              startDecorator: <Delete />,
            } satisfies ActionsItem,
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
