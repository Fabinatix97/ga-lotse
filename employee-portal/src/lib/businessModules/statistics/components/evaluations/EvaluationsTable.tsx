/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEvaluationInfo,
  ApiEvaluationState,
  ApiStatisticsFeature,
} from "@eshg/employee-portal-api/statistics";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
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
import { Box, Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { isDefined, isNonNull, isPlainObject } from "remeda";

import { useExportEvaluationData } from "@/lib/businessModules/statistics/api/downloads/useExportEvaluationData";
import {
  EvaluationOverview,
  EvaluationOverviewTableItem,
} from "@/lib/businessModules/statistics/api/models/evaluationOverview";
import { getEvaluationsQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { DuplicateEvaluationSidebar } from "@/lib/businessModules/statistics/components/evaluations/DuplicateEvaluationSidebar/DuplicateEvaluationSidebar";
import { SaveAsEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveAsEvaluationTemplateSidebar";
import { EvaluationNameChangeModal } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationNameChangeModal";
import {
  ENUM_FALSE_VALUE,
  ENUM_TRUE_VALUE,
  shouldSearchForFalse,
  shouldSearchForTrue,
} from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
import { useDeleteEvaluationWithConfirmation } from "@/lib/businessModules/statistics/components/evaluations/useDeleteEvaluationWithConfirmation";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticsRoleChecks";
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

const columnHelper = createColumnHelper<EvaluationOverviewTableItem>();

function CreateEvaluationsButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="md" startDecorator={<Add />} onClick={onClick}>
      Auswertung erstellen
    </Button>
  );
}

function columns(
  deleteEvaluationWithConfirmation: (
    id: string,
    evaluationName: string,
  ) => void,
  canDelete: (creatorUserId: string) => boolean,
  canWrite: (creatorUserId: string) => boolean,
  canUpdateEvaluation: (creatorUserId: string) => boolean,
  onDuplicate: (item: EvaluationOverviewTableItem) => void,
  onNameChange: (id: string, name: string) => void,
  onSaveAsTemplate: (item: EvaluationOverviewTableItem) => void,
  exportDataFeatureToggle: boolean,
  onExportData: (id: string) => void,
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
            canUpdateEvaluation(props.row.original.userId) && {
              label: "Name ändern",
              onClick: () =>
                onNameChange(props.row.original.id, props.row.original.name),
              disabled:
                props.row.original.state !== ApiEvaluationState.Completed,
              startDecorator: <Edit />,
            },
            canWrite(props.row.original.userId) && {
              label: "Duplizieren",
              onClick: () => {
                onDuplicate(props.row.original);
              },
              disabled:
                props.row.original.state !== ApiEvaluationState.Completed,
              startDecorator: <FileCopy />,
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
            props.row.original.anonymized &&
              exportDataFeatureToggle && {
                label: "Daten exportieren",
                onClick: () => {
                  onExportData(props.row.original.id);
                },
                disabled:
                  props.row.original.state !== ApiEvaluationState.Completed,
                startDecorator: <Download />,
              },
            canDelete(props.row.original.userId) &&
              ({
                label: "Löschen",
                onClick: () =>
                  deleteEvaluationWithConfirmation(
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
  evaluationOverview: EvaluationOverview;
  loading: boolean;
  onCreateEvaluationClick: () => void;
  onAnonymizedFilterChanged: (filter: boolean | undefined) => void;
  manualSortingProps: ManualSortingProps;
  paginationProps: PaginationProps;
}

export function EvaluationsTable({
  evaluationOverview,
  loading,
  onCreateEvaluationClick,
  onAnonymizedFilterChanged,
  manualSortingProps,
  paginationProps,
}: EvaluationsTableProps) {
  const fakeAnonymizationEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.FakeAnonymization,
  );

  const [duplicateEvaluationAction, setDuplicateEvaluationAction] =
    useState<EvaluationOverviewTableItem>();
  const [nameChangeAction, setNameChangeAction] =
    useState<Pick<ApiEvaluationInfo, "id" | "name">>();
  const [
    saveAsEvaluationTemplateSidebarEvaluationId,
    setSaveAsEvaluationTemplateSidebarEvaluationId,
  ] = useState<string | null>(null);

  const userPermissions = useStatisticsRoleChecks();

  const deleteEvaluationWithConfirmation =
    useDeleteEvaluationWithConfirmation();

  const { download: exportData, downloadContainerRef } =
    useExportEvaluationData();

  const filterSettings = useFilterSettings({
    definitions: evaluationsOverviewFilterDefinitions,
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
        data-testid="evaluations-table"
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
            columns={columns(
              deleteEvaluationWithConfirmation,
              userPermissions.canDelete,
              userPermissions.canWrite,
              userPermissions.canUpdateEvaluation,
              setDuplicateEvaluationAction,
              (id, name) => setNameChangeAction({ id, name }),
              (item) => setSaveAsEvaluationTemplateSidebarEvaluationId(item.id),
              fakeAnonymizationEnabled,
              (id) => {
                void exportData({ evaluationId: id });
              },
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
                  onClick={onCreateEvaluationClick}
                  decorator={<Add />}
                />
              </Box>
            )}
          />
        </TableSheet>
      </TablePage>

      {isDefined(duplicateEvaluationAction) && (
        <OverlayBoundary>
          <DuplicateEvaluationSidebar
            onClose={() => setDuplicateEvaluationAction(undefined)}
            originalEvaluation={duplicateEvaluationAction}
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
          <EvaluationNameChangeModal
            open={true}
            onClose={() => setNameChangeAction(undefined)}
            initialName={nameChangeAction.name}
            evaluationId={nameChangeAction.id}
          />
        </OverlayBoundary>
      )}

      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}

const evaluationsOverviewFilterDefinitions = [
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
