/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiChecklistDefinitionVersion } from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { useSyncCentralRepoChecklistDefinition } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { MetadataDetailsSidebar } from "@/lib/businessModules/inspection/components/repository/MetadataDetailsSidebar";
import {
  isCurrentVersion,
  isNewVersion,
  isUpdateableVersion,
} from "@/lib/businessModules/inspection/components/repository/utils";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

interface RepoChecklistDefinitionHeaderRowProps {
  version: ApiChecklistDefinitionVersion;
  repositoryChecklistDefinitionId: number;
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

export function RepoChecklistDefinitionHeaderRow({
  version,
  repositoryChecklistDefinitionId,
  centralRepoVersion,
  isCoreChecklist,
  metadata,
}: Readonly<RepoChecklistDefinitionHeaderRowProps>) {
  const [canEditCoreCld, canEditCld] = useHasUserRolesCheck([
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
    ApiUserRole.InspectionChecklistdefinitionsWrite,
  ]);
  const snackbar = useSnackbar();
  const { mutateAsync: downloadCentralRepoChecklistDefinition } =
    useSyncCentralRepoChecklistDefinition();

  const [open, setOpen] = useState(false);

  function handleDetailsButtonClicked() {
    setOpen(true);
  }

  function handleSidebarClosed() {
    setOpen(false);
  }

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography>Version {version.context.version}</Typography>
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent={"flex-end"}
      >
        <Button onClick={handleDetailsButtonClicked}>Details</Button>
        {!isCurrentVersion(centralRepoVersion, metadata.localCldRepoVersion) &&
          (version.isCoreChecklist ? canEditCoreCld : canEditCld) && (
            <Button
              onClick={() =>
                downloadCentralRepoChecklistDefinition(
                  {
                    centralRepoId: repositoryChecklistDefinitionId,
                    centralRepoVersion,
                    isCoreChecklist,
                  },
                  {
                    onSuccess: () =>
                      snackbar.confirmation(
                        "Checkliste erfolgreich übernommen",
                      ),
                  },
                )
              }
            >
              {isNewVersion(metadata.localCldRepoVersion) && "Übernehmen"}
              {isUpdateableVersion(
                centralRepoVersion,
                metadata.localCldRepoVersion,
              ) && "Aktualisieren"}
            </Button>
          )}
      </Stack>
      <MetadataDetailsSidebar
        open={open}
        metadata={{
          centralRepoId: repositoryChecklistDefinitionId,
          changeLog: metadata.changeLog,
          contact: metadata.contact,
          description: metadata.description,
          localCldRepoVersion: metadata.localCldRepoVersion,
          origin: metadata.origin,
          createdAt: metadata.createdAt,
          isCoreChecklist: isCoreChecklist,
          name: version.context.name,
          objectType: version.objectType?.name ?? "",
          version: centralRepoVersion,
          isExpandable: version.context.expandable ?? true,
        }}
        onClose={handleSidebarClosed}
      />
    </Stack>
  );
}
