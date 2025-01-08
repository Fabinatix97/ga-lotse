/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiChecklistDefinition,
  ApiChecklistDefinitionVersion,
} from "@eshg/employee-portal-api/inspection";
import { ConfirmationDialogProps } from "@eshg/lib-portal/components/confirmationDialog/BaseConfirmationDialog";
import { Snackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  CheckCircle,
  CloudSync,
  CloudUpload,
  CopyAll,
  CropFree,
  Edit,
  History,
} from "@mui/icons-material";
import { Chip, Stack, Typography } from "@mui/joy";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { isNonNullish, isNullish } from "remeda";

import { FormChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { showPublishChecklistDefinitionDialog } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";
import { ActiveChecklistIcon } from "@/lib/businessModules/inspection/components/icons/ActiveChecklistIcon";
import { CorechecklistIcon } from "@/lib/businessModules/inspection/components/icons/CorechecklistIcon";
import { ExclusiveCorechecklistIcon } from "@/lib/businessModules/inspection/components/icons/ExclusiveCorechecklistIcon";
import { InactiveChecklistIcon } from "@/lib/businessModules/inspection/components/icons/InactiveChecklistIcon";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";

const columnHelper = createColumnHelper<ApiChecklistDefinition>();

interface ChecklistDefinitionOverviewPermissions {
  canEditCoreChecklists: boolean;
  canUploadRepoChecklists: boolean;
  canUploadRepoCoreChecklists: boolean;
  canEditChecklists: boolean;
}

export function generateChecklistDefinitionOverviewTableColumns(
  snackbar: Snackbar,
  router: AppRouterInstance,
  {
    canEditCoreChecklists,
    canUploadRepoChecklists,
    canUploadRepoCoreChecklists,
    canEditChecklists,
  }: ChecklistDefinitionOverviewPermissions,
  {
    addCldVersion,
    openConfirmationDialog,
    handleHistoryButtonClick,
    handleUploadRepoButtonClick,
    handleUpdateRepoButtonClick,
    editDraftCldVersion,
  }: ActionItemActions,
) {
  return [
    columnHelper.display({
      header: "",
      id: "coreChecklist",
      cell: (info) => (
        <Stack direction="row" justifyContent="center">
          {info.row.original.coreChecklist && (
            <>
              {info.row.original.expandable ? (
                <CorechecklistIcon
                  size="sm"
                  aria-hidden={false}
                  titleAccess="Kern-Checkliste"
                  aria-label="Kern-Checkliste"
                />
              ) : (
                <ExclusiveCorechecklistIcon
                  size="sm"
                  aria-hidden={false}
                  titleAccess="Exklusive Kern-Checkliste"
                  aria-label="Exklusive Kern-Checkliste"
                />
              )}
            </>
          )}
        </Stack>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 40,
        cellStyle: "icon",
        headerLabel: "Kern-Checkliste",
      },
    }),
    columnHelper.display({
      header: "",
      id: "deleted",
      cell: (info) => (
        <Stack direction="row" justifyContent="center">
          {info.row.original.mostRecentVersion.context.deleted && (
            <InactiveChecklistIcon
              size="sm"
              aria-hidden={false}
              titleAccess="inaktive Checkliste"
              aria-label="inaktive Checkliste"
            />
          )}
        </Stack>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 40,
        cellStyle: "icon",
        headerLabel: "Inaktiv",
      },
    }),
    columnHelper.accessor("mostRecentVersion.context.name", {
      header: "Name",
      cell: (info) => (
        <Stack direction="row" spacing={0.5}>
          {info.renderValue()}
        </Stack>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 406,
      },
    }),
    columnHelper.accessor("objectType.name", {
      header: "Objekttyp",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 366,
      },
    }),
    columnHelper.accessor("versions", {
      header: "Versionen",
      cell: versionsCellRenderFunction,
      sortingFn: (colA, colB) => {
        return (
          (colA.original.mostRecentRepositoryVersion ?? 0) -
            (colB.original.mostRecentRepositoryVersion ?? 0) ||
          colA.original.mostRecentVersion.context.version -
            colB.original.mostRecentVersion.context.version
        );
      },
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 200,
      },
    }),
    columnHelper.display({
      header: "Status",
      cell: (info) => (
        <Stack
          direction="row"
          gap={1}
          flexWrap={undefined}
          sx={{
            overflow: "visible",
          }}
        >
          {!info.row.original.published && (
            <Chip variant="soft" color="warning" size="md" sx={{ margin: 0 }}>
              Entwurf
            </Chip>
          )}
          {(info.row.original.published ||
            info.row.original.mostRecentVersion.context.version > 1) && (
            <Chip variant="soft" color="success" size="md" sx={{ margin: 0 }}>
              Veröffentlicht
            </Chip>
          )}
        </Stack>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 200,
      },
    }),
    columnHelper.accessor("lastModified", {
      header: "Zuletzt aktualisiert",
      cell: (info) => (
        <Typography>{formatDateTime(info.getValue())}</Typography>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 186,
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      enableSorting: false,
      cell: (info) => {
        const checklistRow = info.row.original;
        return (
          <ActionsMenu
            actionItems={generateActionItems(
              checklistRow,
              snackbar,
              router,
              {
                showUploadRepoMenuEntry: showUploadRepoMenuEntry(checklistRow, {
                  canUploadRepoChecklists,
                  canUploadRepoCoreChecklists,
                }),
                showUpdateRepoMenuEntry: showUpdateRepoMenuEntry(checklistRow, {
                  canUploadRepoChecklists,
                  canUploadRepoCoreChecklists,
                }),
                canEditChecklists,
                canEditCoreChecklists,
              },
              {
                addCldVersion,
                openConfirmationDialog,
                handleHistoryButtonClick,
                handleUploadRepoButtonClick,
                handleUpdateRepoButtonClick,
                editDraftCldVersion,
              },
            )}
          />
        );
      },
      meta: {
        width: 96,
        cellStyle: "button",
        textAlign: "right",
      },
    }),
  ];
}

function versionsCellRenderFunction(
  props: CellContext<ApiChecklistDefinition, ApiChecklistDefinitionVersion[]>,
): string {
  let versionString = `lokal ${props.row.original.mostRecentVersion.context.version.toString()}`;
  if (isNonNullish(props.row.original.mostRecentRepositoryVersion)) {
    versionString =
      versionString +
      ` remote ${props.row.original.mostRecentRepositoryVersion.toString()}`;
  }
  return versionString;
}

interface ActionItemPermissions {
  showUploadRepoMenuEntry: boolean;
  showUpdateRepoMenuEntry: boolean;
  canEditChecklists: boolean;
  canEditCoreChecklists: boolean;
}

interface ActionItemActions {
  openConfirmationDialog: (
    confirmationDialog: Omit<ConfirmationDialogProps, "open" | "onClose"> & {
      onClose?: ConfirmationDialogProps["onClose"];
    },
  ) => void;
  handleHistoryButtonClick: (def: ApiChecklistDefinition) => void;
  handleUploadRepoButtonClick: (def: ApiChecklistDefinition) => void;
  handleUpdateRepoButtonClick: (def: ApiChecklistDefinition) => void;
  addCldVersion: UseMutateAsyncFunction<
    ApiChecklistDefinitionVersion,
    Error,
    {
      defId: string;
      cldVersion:
        | FormChecklistDefinitionVersion
        | ApiChecklistDefinitionVersion;
    },
    unknown
  >;
  editDraftCldVersion: UseMutateAsyncFunction<
    ApiChecklistDefinitionVersion,
    Error,
    {
      versionId: string;
      cldVersion:
        | FormChecklistDefinitionVersion
        | ApiChecklistDefinitionVersion;
    },
    unknown
  >;
}

function generateActionItems(
  definition: ApiChecklistDefinition,
  snackbar: Snackbar,
  router: AppRouterInstance,
  {
    showUploadRepoMenuEntry,
    showUpdateRepoMenuEntry,
    canEditChecklists,
    canEditCoreChecklists,
  }: ActionItemPermissions,
  {
    openConfirmationDialog,
    handleHistoryButtonClick,
    handleUploadRepoButtonClick,
    handleUpdateRepoButtonClick,
    addCldVersion,
    editDraftCldVersion,
  }: ActionItemActions,
) {
  const hideEdit =
    !canEditChecklists || (definition.coreChecklist && !canEditCoreChecklists);
  const published = definition.published;
  const deleted = definition.deleted;
  const actionItems: ActionsItem[] = [];
  const mostRecentVersion = definition.mostRecentVersion;

  if (!published) {
    actionItems.push(
      hideEdit
        ? {
            label: "Anzeigen",
            onClick: routes.checklists.definitions.viewVersion(
              definition.id,
              definition.mostRecentVersion.context.id,
            ),
            startDecorator: <CropFree />,
          }
        : {
            label: "Bearbeiten",
            onClick: routes.checklists.definitions.newVersion(
              definition.id,
              definition.mostRecentVersion.context.id,
            ),
            startDecorator: <Edit />,
          },
      {
        label: "Historie",
        onClick: () => handleHistoryButtonClick(definition),
        startDecorator: <History />,
      },
      ...(hideEdit
        ? []
        : [
            {
              label: "Veröffentlichen",
              onClick: () =>
                showPublishChecklistDefinitionDialog(
                  openConfirmationDialog,
                  mostRecentVersion.context.name,
                  async () => {
                    await editDraftCldVersion(
                      {
                        versionId: mostRecentVersion.context.id,
                        cldVersion: {
                          ...mostRecentVersion,
                          context: {
                            ...mostRecentVersion.context,
                            published: true,
                          },
                        },
                      },
                      {
                        onSuccess: () => {
                          snackbar.confirmation(
                            "Die Checkliste wurde veröffentlicht und kann nun eingesetzt werden.",
                          );
                          router.push(routes.checklists.definitions.index);
                        },
                      },
                    );
                  },
                ),
              startDecorator: <CheckCircle />,
            },
          ]),
    );
  } else {
    actionItems.push(
      ...(hideEdit
        ? [
            {
              label: "Anzeigen",
              onClick: routes.checklists.definitions.viewVersion(
                definition.id,
                definition.mostRecentVersion.context.id,
              ),
              startDecorator: <CropFree />,
            },
          ]
        : [
            {
              label: "Für neue Version nutzen",
              onClick: routes.checklists.definitions.newVersion(
                definition.id,
                definition.mostRecentVersion.context.id,
              ),
              startDecorator: <CopyAll />,
            },
          ]),
      {
        label: "Historie",
        onClick: () => handleHistoryButtonClick(definition),
        startDecorator: <History />,
      },
      ...(showUploadRepoMenuEntry
        ? [
            {
              label: "Hochladen",
              onClick: () => {
                handleUploadRepoButtonClick(definition);
              },
              startDecorator: <CloudUpload />,
            },
          ]
        : []),
      ...(showUpdateRepoMenuEntry
        ? [
            {
              label: "Aktualisieren",
              onClick: () => {
                handleUpdateRepoButtonClick(definition);
              },
              startDecorator: <CloudSync />,
            },
          ]
        : []),
      ...(hideEdit
        ? []
        : [
            deleted
              ? {
                  label: "Aktiv stellen",
                  onClick: async () => {
                    await addCldVersion(
                      {
                        defId: mostRecentVersion.context.defId,
                        cldVersion: {
                          ...mostRecentVersion,
                          context: {
                            ...mostRecentVersion.context,
                            published: true,
                            deleted: false,
                          },
                        },
                      },
                      {
                        onSuccess: () =>
                          router.push(routes.checklists.definitions.index),
                      },
                    );
                  },
                  startDecorator: <ActiveChecklistIcon />,
                }
              : {
                  label: "Inaktiv stellen",
                  onClick: async () => {
                    await addCldVersion(
                      {
                        defId: mostRecentVersion.context.defId,
                        cldVersion: {
                          ...mostRecentVersion,
                          context: {
                            ...mostRecentVersion.context,
                            published: true,
                            deleted: true,
                          },
                        },
                      },
                      {
                        onSuccess: () =>
                          router.push(routes.checklists.definitions.index),
                      },
                    );
                  },
                  startDecorator: <InactiveChecklistIcon />,
                },
          ]),
    );
  }

  return actionItems;
}

export function showUploadRepoMenuEntry(
  def: ApiChecklistDefinition,
  {
    canUploadRepoChecklists,
    canUploadRepoCoreChecklists,
  }: {
    canUploadRepoChecklists: boolean;
    canUploadRepoCoreChecklists: boolean;
  },
): boolean {
  if (
    isNonNullish(def.mostRecentRepositoryVersion) ||
    !def.published ||
    def.deleted
  ) {
    return false;
  }
  if (!def.coreChecklist) {
    return canUploadRepoChecklists;
  } else {
    return canUploadRepoCoreChecklists;
  }
}

export function showUpdateRepoMenuEntry(
  def: ApiChecklistDefinition,
  {
    canUploadRepoChecklists,
    canUploadRepoCoreChecklists,
  }: {
    canUploadRepoChecklists: boolean;
    canUploadRepoCoreChecklists: boolean;
  },
): boolean {
  if (
    isNullish(def.mostRecentRepositoryVersion) ||
    def.mostRecentVersionBasedOnRepo ===
      def.mostRecentVersion.context.version ||
    !def.published ||
    def.deleted
  ) {
    return false;
  }
  if (!def.coreChecklist) {
    return canUploadRepoChecklists;
  } else {
    return canUploadRepoCoreChecklists;
  }
}
