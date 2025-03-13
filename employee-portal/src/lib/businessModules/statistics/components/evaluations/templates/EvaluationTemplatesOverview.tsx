/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { useHasUserRoleCheck } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add, CloudUpload, Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { startTransition, useState } from "react";
import { isPlainObject } from "remeda";

import { translateDataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { EvaluationTemplateWithUserInfo } from "@/lib/businessModules/statistics/api/models/evaluationTemplatesOverview";
import { useDeleteEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteEvaluationTemplate";
import { useGetAvailableDataSources } from "@/lib/businessModules/statistics/api/queries/useGetAvailableDataSources";
import { useGetEvaluationTemplatesOverview } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplatesOverview";
import { useUpdateEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/UpdateEvaluationTemplateSidebar";
import { useCreateEvaluationFromTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/templates/CreateEvaluationFromTemplateSidebar/CreateEvaluationFromTemplateSidebar";
import { useEvaluationTemplateDetailsSidebar } from "@/lib/businessModules/statistics/components/evaluations/templates/EvaluationTemplateDetailsSidebar";
import { createFilterDefinitions } from "@/lib/businessModules/statistics/components/evaluations/templates/filterDefinitions";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { useFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useTableSorting } from "@/lib/shared/hooks/table/useTableSorting";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import { useUploadTemplateSidebar } from "./UploadTemplateSidebar/UploadTemplateSidebar";

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

  const [filterValues, setFilterValues] = useState<FilterValue[]>([]);
  const evaluationTemplatesOverview = useGetEvaluationTemplatesOverview(
    {
      page,
      pageSize,
      sortDirection,
      sortKey,
    },
    filterValues,
  );
  const dataSources = useGetAvailableDataSources();
  const filterSettings = useFilterSettings({
    definitions: createFilterDefinitions(dataSources),
    onValuesSubmit: (filterValues) => {
      startTransition(() => {
        setFilterValues(filterValues);
        resetPageNumber();
      });
    },
    showSearch: false,
  });

  const writePermission = useHasUserRoleCheck(
    ApiUserRole.StatisticsStatisticsWrite,
  );
  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteEvaluationTemplate = useDeleteEvaluationTemplate();
  const evaluationTemplateDetailsSidebar =
    useEvaluationTemplateDetailsSidebar();
  const updateEvaluationTemplateSidebar = useUpdateEvaluationTemplateSidebar();
  const uploadTemplateSidebar = useUploadTemplateSidebar();
  const createEvaluationFromTemplateSidebar =
    useCreateEvaluationFromTemplateSidebar();

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

  function openUpdateEvaluationTemplateSidebar(evaluationTemplateId: string) {
    updateEvaluationTemplateSidebar.open({
      evaluationTemplateId,
    });
  }

  function openUploadTemplateSidebar(templateId: string) {
    uploadTemplateSidebar.open({
      templateId,
    });
  }

  function openCreateEvaluationFromTemplateSidebar(
    evaluationTemplateId: string,
  ) {
    createEvaluationFromTemplateSidebar.open({
      evaluationTemplateId,
    });
  }

  function openTemplateDetails(templateId: string) {
    evaluationTemplateDetailsSidebar.open({
      evaluationTemplateId: templateId,
      onEditEvaluationTemplate: () => {
        openUpdateEvaluationTemplateSidebar(templateId);
      },
      onCreateEvaluation: () => {
        openCreateEvaluationFromTemplateSidebar(templateId);
      },
      onUploadEvaluation: () => {
        openUploadTemplateSidebar(templateId);
      },
    });
  }

  return (
    <TablePage
      data-testid="evaluation-templates-overview-table"
      fullHeight
      controls={
        <ButtonBar
          left={<FilterButton {...filterSettings.filterButtonProps} />}
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
            openUpdateEvaluationTemplateSidebar,
            openCreateEvaluationFromTemplateSidebar,
            openUploadTemplateSidebar,
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
            onClick: (row) => () => openTemplateDetails(row.original.id),
          }}
        />
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
    columnHelper.accessor("dataSourceSensitivity", {
      header: "Sensibilität",
      cell: (props) => translateDataSourceSensitivity(props.getValue()),
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
            canWrite(props.row.original.userId) &&
              props.row.original.userMayCreateEvaluation && {
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
