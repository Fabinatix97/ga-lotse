/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CheckCircle,
  CloudSync,
  CloudUpload,
  CopyAll,
  CropFree,
  Delete,
  Edit,
  FactCheckOutlined,
} from "@mui/icons-material";
import { ColorPaletteProp, Sheet, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { isEmpty, isNonNullish } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import {
  ApiChecklistDefinition,
  ApiChecklistDefinitionVersion,
} from "@eshg/inspection-api";
import {
  ActionsItem,
  ActionsMenu,
  useConfirmationDialog,
  useHasUserRolesCheck,
} from "@eshg/lib-employee-portal";
import {
  Alert,
  ConfirmationDialogProps,
  Snackbar,
  formatDateTime,
  useSnackbar,
} from "@eshg/lib-portal";

import {
  FormChecklistDefinitionVersion,
  useAddChecklistDefinitionVersion,
  useDeleteDraftChecklistDefinitionVersion,
  useEditDraftChecklistDefinitionVersion,
} from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import {
  showDeleteChecklistDefinitionDialog,
  showPublishChecklistDefinitionDialog,
} from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";
import {
  showUpdateRepoMenuEntry,
  showUploadRepoMenuEntry,
} from "@/lib/businessModules/inspection/components/checklistDefinition/overview/columns";
import { ActiveChecklistIcon } from "@/lib/businessModules/inspection/components/icons/ActiveChecklistIcon";
import { CorechecklistIcon } from "@/lib/businessModules/inspection/components/icons/CorechecklistIcon";
import { EditDraftIcon } from "@/lib/businessModules/inspection/components/icons/EditDraftIcon";
import { ExclusiveCorechecklistIcon } from "@/lib/businessModules/inspection/components/icons/ExclusiveCorechecklistIcon";
import { InactiveChecklistIcon } from "@/lib/businessModules/inspection/components/icons/InactiveChecklistIcon";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export function VersionSheet({
  definition,
  version,
  nameChange,
  isCurrentVersion,
  onUploadCldClick,
  onUpdateCldClick,
  label,
}: Readonly<{
  definition: ApiChecklistDefinition;
  version: ApiChecklistDefinitionVersion;
  isCurrentVersion: boolean;
  nameChange?: string;
  onUploadCldClick: () => void;
  onUpdateCldClick: () => void;
  label: string;
}>) {
  const snackbar = useSnackbar();
  const router = useRouter();
  const { openConfirmationDialog } = useConfirmationDialog();
  const [
    canEditChecklists,
    canEditCoreChecklists,
    canUploadRepoChecklists,
    canUploadRepoCoreChecklists,
  ] = useHasUserRolesCheck([
    ApiUserRole.InspectionChecklistdefinitionsWrite,
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
    ApiUserRole.InspectionCentralrepositoryWrite,
    ApiUserRole.InspectionCentralrepositoryWriteCorechecklists,
  ]);
  const { mutateAsync: editDraftCldVersion } =
    useEditDraftChecklistDefinitionVersion();
  const { mutateAsync: deleteDraftCldVersion } =
    useDeleteDraftChecklistDefinitionVersion();
  const { mutateAsync: addCldVersion } = useAddChecklistDefinitionVersion();
  const modifiedBy =
    !isEmpty(version.modifiedBy?.firstName) &&
    !isEmpty(version.modifiedBy?.lastName)
      ? `${version.modifiedBy!.firstName} ${version.modifiedBy!.lastName}`
      : "Unbekannter Benutzer";
  const actionItems: ActionsItem[] = generateActionItems(
    definition,
    version,
    snackbar,
    router,
    isCurrentVersion,
    {
      canEditCoreChecklists,
      canEditChecklists,
      canUploadRepoChecklists,
      canUploadRepoCoreChecklists,
    },
    {
      editDraftCldVersion,
      deleteDraftCldVersion,
      addCldVersion,
      openConfirmationDialog,
      onUploadCldClick,
      onUpdateCldClick,
    },
  );

  function handleSheetClicked() {
    if (!isCurrentVersion) {
      router.push(
        routes.checklists.definitions.viewVersion(
          version.context.defId,
          version.context.id,
        ),
      );
    }
  }

  let VersionInfoTitle = `Lokal ${version.context.version}`;
  if (isNonNullish(version.context.repositoryVersion)) {
    VersionInfoTitle += `, Remote ${version.context.repositoryVersion}`;
  }

  return (
    <Sheet
      sx={{
        padding: 2,
        borderRadius: (theme) => theme.radius.lg,
        border: "1px solid",
        borderColor: "#636B744D",
        "&:hover": {
          cursor: () => (!isCurrentVersion ? "pointer" : undefined),
          backgroundColor: (theme) => theme.palette.neutral.plainHoverBg,
        },
      }}
      aria-label={label}
      onClick={handleSheetClicked}
    >
      <Stack direction="column" gap={2}>
        <Stack direction="row" gap={2}>
          <Stack direction="column">
            <Stack
              sx={{
                padding: 1,
                backgroundColor: (theme) => theme.palette.background.level1,
                borderRadius: "5px",
              }}
            >
              <VersionIcon version={version} />
            </Stack>
          </Stack>
          <Stack direction="column" gap={2}>
            <VersionInfo
              title={VersionInfoTitle}
              description={`Zuletzt bearbeitet am ${formatDateTime(version.context.lastModified)} von ${modifiedBy}`}
            />
          </Stack>
          {actionItems.length > 0 && (
            <Stack direction="column" gap={2}>
              <ActionsMenu actionItems={actionItems} />
            </Stack>
          )}
        </Stack>
        {nameChange && (
          <Stack direction="row">
            <Alert
              color="primary"
              message={`Die Checkliste wurde umbenannt zu „${nameChange}”.`}
              sx={{ width: "100%" }}
            />
          </Stack>
        )}
      </Stack>
    </Sheet>
  );
}

function VersionInfo({
  title,
  description,
  sx,
}: Readonly<{
  title: string;
  description?: string;
  sx?: SxProps;
}>) {
  return (
    <Stack direction="column" gap={0.5} sx={sx}>
      <Typography level="title-md" fontWeight="600">
        {title}
      </Typography>
      {description && (
        <Typography level="body-md" fontWeight="400" textColor="text.secondary">
          {description}
        </Typography>
      )}
    </Stack>
  );
}

function VersionIcon({
  version,
}: Readonly<{
  version: ApiChecklistDefinitionVersion;
}>) {
  if (!version.context.published) {
    return (
      <EditDraftIcon
        aria-hidden={false}
        titleAccess="Entwurf"
        aria-label="Entwurf"
      />
    );
  } else if (version.context.deleted) {
    return (
      <InactiveChecklistIcon
        aria-hidden={false}
        titleAccess="inaktive Checkliste"
        aria-label="inaktive Checkliste"
      />
    );
  } else if (version.isCoreChecklist) {
    return version.context.expandable ? (
      <CorechecklistIcon
        aria-hidden={false}
        titleAccess="Kern-Checkliste"
        aria-label="Kern-Checkliste"
      />
    ) : (
      <ExclusiveCorechecklistIcon
        aria-hidden={false}
        titleAccess="Exklusive Kern-Checkliste"
        aria-label="Exklusive Kern-Checkliste"
      />
    );
  } else {
    return (
      <FactCheckOutlined
        aria-hidden={false}
        titleAccess="Checkliste"
        aria-label="Checkliste"
      />
    );
  }
}

function generateActionItems(
  definition: ApiChecklistDefinition,
  version: ApiChecklistDefinitionVersion,
  snackbar: Snackbar,
  router: AppRouterInstance,
  isCurrentVersion: boolean,
  permissions: {
    canEditChecklists: boolean;
    canEditCoreChecklists: boolean;
    canUploadRepoChecklists: boolean;
    canUploadRepoCoreChecklists: boolean;
  },
  {
    editDraftCldVersion,
    deleteDraftCldVersion,
    addCldVersion,
    openConfirmationDialog,
    onUploadCldClick,
    onUpdateCldClick,
  }: {
    onUploadCldClick: () => void;
    onUpdateCldClick: () => void;
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
    deleteDraftCldVersion: UseMutateAsyncFunction<
      void,
      Error,
      {
        versionId: string;
      },
      unknown
    >;
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
    openConfirmationDialog: (
      confirmationDialog: Omit<ConfirmationDialogProps, "open" | "onClose"> & {
        onClose?: ConfirmationDialogProps["onClose"];
      },
    ) => void;
  },
) {
  const actionItems: ActionsItem[] = [];
  if (!isCurrentVersion) return actionItems;

  const published = version.context.published;
  const hideEdit =
    !permissions.canEditChecklists ||
    (version.isCoreChecklist && !permissions.canEditCoreChecklists);

  if (!published) {
    actionItems.push(
      ...(hideEdit
        ? [
            {
              label: "Anzeigen",
              onClick: routes.checklists.definitions.viewVersion(
                version.context.defId,
                version.context.id,
              ),
              startDecorator: <CropFree />,
            },
          ]
        : [
            {
              label: "Bearbeiten",
              onClick: routes.checklists.definitions.newVersion(
                version.context.defId,
                version.context.id,
              ),
              startDecorator: <Edit />,
            },
            {
              label: "Veröffentlichen",
              onClick: () =>
                showPublishChecklistDefinitionDialog(
                  openConfirmationDialog,
                  version.context.name,
                  async () => {
                    await editDraftCldVersion(
                      {
                        versionId: version.context.id,
                        cldVersion: {
                          ...version,
                          context: { ...version.context, published: true },
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
            {
              label: "Löschen",
              color: "danger" as ColorPaletteProp,
              onClick: () =>
                showDeleteChecklistDefinitionDialog(
                  openConfirmationDialog,
                  version.context.name,
                  async () => {
                    await deleteDraftCldVersion(
                      {
                        versionId: version.context.id,
                      },
                      {
                        onSuccess: () => {
                          router.push(routes.checklists.definitions.index);
                        },
                      },
                    );
                  },
                ),
              startDecorator: <Delete />,
            },
          ]),
      // {
      //   label: "Löschen",
      //   onClick: () => {
      //     snackbar.notification("Noch nicht implementiert.");
      //   },
      //   color: "danger" as ColorPaletteProp,
      //   startDecorator: <Delete />,
      // },
    );
  } else {
    // published === true
    actionItems.push(
      {
        label: "Anzeigen",
        onClick: routes.checklists.definitions.viewVersion(
          version.context.defId,
          version.context.id,
        ),
        startDecorator: <CropFree />,
      },
      ...(hideEdit
        ? []
        : [
            {
              label: "Für neue Version nutzen",
              onClick: routes.checklists.definitions.newVersion(
                version.context.defId,
                version.context.id,
              ),
              startDecorator: <CopyAll />,
            },
            ...(version.context.deleted
              ? [
                  {
                    label: "Aktiv stellen",
                    onClick: async () => {
                      await addCldVersion(
                        {
                          defId: version.context.defId,
                          cldVersion: {
                            ...version,
                            context: {
                              ...version.context,
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
                  },
                ]
              : [
                  {
                    label: "Inaktiv stellen",
                    onClick: async () => {
                      await addCldVersion(
                        {
                          defId: version.context.defId,
                          cldVersion: {
                            ...version,
                            context: {
                              ...version.context,
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
          ]),
      ...(showUploadRepoMenuEntry(definition, permissions)
        ? [
            {
              label: "Hochladen",
              onClick: onUploadCldClick,
              startDecorator: <CloudUpload />,
            },
          ]
        : []),
      ...(showUpdateRepoMenuEntry(definition, permissions)
        ? [
            {
              label: "Aktualisieren",
              onClick: () => onUpdateCldClick,
              startDecorator: <CloudSync />,
            },
          ]
        : []),
    );
  }
  return actionItems;
}
