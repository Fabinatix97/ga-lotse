/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Sheet, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import { ApiChecklistDefinitionVersion } from "@eshg/inspection-api";
import { useHasUserRolesCheck } from "@eshg/lib-employee-portal";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";

import { useSyncCentralRepoChecklistDefinition } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { CLDInfoCardCoreChecklistLabel } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/CLDInfoCard";
import { useMetadataDetailsSidebar } from "@/lib/businessModules/inspection/components/repository/MetadataDetailsSidebar";
import {
  isCurrentVersion,
  isNewVersion,
  isUpdateableVersion,
} from "@/lib/businessModules/inspection/components/repository/utils";

interface RepoCLDInfoCardProps {
  cldVersion: ApiChecklistDefinitionVersion;
  centralRepoId: number;
  centralRepoVersion: number;
  isCoreChecklist: boolean;
  metadata: {
    changeLog?: string;
    contact?: string;
    description?: string;
    localCldRepoVersion?: number;
    origin: string;
    createdAt: Date;
  };
}

export function RepoCLDInfoCard({
  cldVersion,
  centralRepoId,
  centralRepoVersion,
  isCoreChecklist,
  metadata,
}: Readonly<RepoCLDInfoCardProps>) {
  const snackbar = useSnackbar();
  const metadataDetailsSidebar = useMetadataDetailsSidebar();
  const { mutate: syncCentralRepoChecklistDefinition, isPending } =
    useSyncCentralRepoChecklistDefinition();

  const createdAtDateIso = metadata.createdAt.toISOString();
  const createdAtDateHuman = formatDateTime(metadata.createdAt);

  const showSyncButton = useCanSyncRepoCLD({
    cldVersion,
    centralRepoVersion,
    metadata,
  });

  function handleSubmit() {
    syncCentralRepoChecklistDefinition(
      {
        centralRepoId,
        centralRepoVersion,
        isCoreChecklist,
      },
      {
        onSuccess: () =>
          snackbar.confirmation("Checkliste erfolgreich übernommen"),
      },
    );
  }

  function openDetails() {
    metadataDetailsSidebar.open({
      metadata: {
        ...metadata,
        centralRepoId,
        isCoreChecklist,
        name: cldVersion.context.name,
        objectType: cldVersion.objectType?.name ?? "",
        version: centralRepoVersion,
        isExpandable: cldVersion.context.expandable ?? true,
      },
    });
  }

  return (
    <Sheet component="section" aria-label="Checklistdefinition Informationen">
      <Stack gap={2}>
        <Typography level="title-lg" aria-label="Checklistdefinition Name">
          {cldVersion.context.name}
        </Typography>
        <CLDInfoCardCoreChecklistLabel cldVersion={cldVersion} />
        <Typography>
          <span>Version: </span>
          <span>{cldVersion.context.version}</span>
        </Typography>
        {isDefined(cldVersion.objectType) && (
          <Typography aria-label="Objekttyp">
            {cldVersion.objectType.name}
          </Typography>
        )}
        <Typography>
          <span>Veröffentlicht von </span>
          <span>{metadata.contact}</span>
          <span> am </span>
          <time dateTime={createdAtDateIso}>{createdAtDateHuman}</time>
        </Typography>
        <Button onClick={openDetails}>Details</Button>
        {showSyncButton && (
          <SubmitButton submitting={isPending} onClick={handleSubmit}>
            {isNewVersion(metadata.localCldRepoVersion) && "Übernehmen"}
            {isUpdateableVersion(
              centralRepoVersion,
              metadata.localCldRepoVersion,
            ) && "Aktualisieren"}
          </SubmitButton>
        )}
      </Stack>
    </Sheet>
  );
}

function useCanSyncRepoCLD({
  cldVersion,
  centralRepoVersion,
  metadata,
}: Readonly<
  Pick<RepoCLDInfoCardProps, "cldVersion" | "centralRepoVersion" | "metadata">
>): boolean {
  const [canEditCoreCld, canEditCld] = useHasUserRolesCheck([
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
    ApiUserRole.InspectionChecklistdefinitionsWrite,
  ]);

  return (
    !isCurrentVersion(centralRepoVersion, metadata.localCldRepoVersion) &&
    (cldVersion.isCoreChecklist ? canEditCoreCld : canEditCld)
  );
}
