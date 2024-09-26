/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import {
  ApiChecklistDefinition,
  ApiChecklistDefinitionVersion,
} from "@eshg/employee-portal-api/inspection";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { Stack, Typography } from "@mui/joy";

import { useGetChecklistDefinitionVersions } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

import { VersionSheet } from "./VersionSheet";

interface CreateChecklistVersionsSidebarProps {
  open: boolean;
  onClose: () => void;
  checklistDefinition: ApiChecklistDefinition;
  onUploadCldClick: () => void;
  onUpdateCldClick: () => void;
}

export function ChecklistVersionsSidebar(
  props: Readonly<CreateChecklistVersionsSidebarProps>,
) {
  return (
    <OverlayBoundary>
      <ChecklistVersionsSidebarWithQuery {...props} />
    </OverlayBoundary>
  );
}

function ChecklistVersionsSidebarWithQuery({
  open,
  onClose,
  checklistDefinition,
  onUploadCldClick,
  onUpdateCldClick,
}: Readonly<CreateChecklistVersionsSidebarProps>) {
  const { data: versions } = useGetChecklistDefinitionVersions(
    checklistDefinition.id,
  );
  const nameChangeMap = computeNameChangeMap(versions);
  const [canEditChecklists, canEditCoreChecklists] = useHasUserRolesCheck([
    ApiUserRole.InspectionChecklistdefinitionsWrite,
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
  ]);
  const permissions = { canEditCoreChecklists, canEditChecklists };

  const newestVersion = versions[versions.length - 1]!;
  const oldVersions = versions.slice(0, -1);

  function handleClose() {
    onClose();
  }

  return (
    <Sidebar open={open} onClose={handleClose}>
      <SidebarContent title={"Historie"}>
        <Stack direction="column" gap={4}>
          <Typography level="h4" component="p" textColor="text.primary">
            {`Versionen der ${newestVersion.isCoreChecklist ? "Kernchecklisten-Definition" : "Checklisten-Definition"}: “${newestVersion?.context.name ?? ""}“`}
          </Typography>
          <ChecklistHint version={newestVersion} permissions={permissions} />
          <Stack direction="column" gap={2}>
            <Typography fontSize="14px" lineHeight="21px" fontWeight="500">
              {newestVersion.context.published ? "Aktuelle Version" : "Entwurf"}
            </Typography>
            <VersionSheet
              key={newestVersion.context.id}
              definition={checklistDefinition}
              version={newestVersion}
              isCurrentVersion={true}
              nameChange={nameChangeMap.get(newestVersion.context.id)}
              onUploadCldClick={onUploadCldClick}
              onUpdateCldClick={onUpdateCldClick}
            />
            {oldVersions.length > 0 && (
              <Typography fontSize="14px" lineHeight="21px" fontWeight="500">
                Ältere Versionen
              </Typography>
            )}
            {oldVersions.toReversed().map((version) => {
              return (
                <VersionSheet
                  key={version.context.id}
                  definition={checklistDefinition}
                  version={version}
                  isCurrentVersion={false}
                  nameChange={nameChangeMap.get(version.context.id)}
                  onUploadCldClick={onUploadCldClick}
                  onUpdateCldClick={onUpdateCldClick}
                />
              );
            })}
          </Stack>
        </Stack>
      </SidebarContent>
    </Sidebar>
  );
}

function computeNameChangeMap(
  versions: ApiChecklistDefinitionVersion[],
): Map<string, string | undefined> {
  const nameChangeList: { key: string; name?: string }[] = [];

  // set nameChangeList.name if previous name != current name, else undefined
  versions.forEach((version, idx) => {
    if (idx === 0) {
      nameChangeList.push({ key: version.context.id, name: undefined });
    } else {
      const prevValue = versions[idx - 1]?.context.name;
      nameChangeList.push({
        key: version.context.id,
        name:
          prevValue !== version.context.name ? version.context.name : undefined,
      });
    }
  });

  return new Map(nameChangeList.map((v) => [v.key, v.name]));
}

function ChecklistHint({
  version,
  permissions: { canEditCoreChecklists, canEditChecklists },
}: Readonly<{
  version: ApiChecklistDefinitionVersion;
  permissions: { canEditCoreChecklists: boolean; canEditChecklists: boolean };
}>) {
  return (
    <>
      {version.context.published &&
        version.context.deleted &&
        (version.isCoreChecklist ? (
          <Alert
            color={"primary"}
            message={`Inaktive Checklisten können nicht für Begehungen eingesetzt werden.${canEditCoreChecklists ? " Sie können die Checkliste jedoch wieder auf aktiv setzen." : ""}`}
            sx={{ width: "100%" }}
          />
        ) : (
          <Alert
            color={"primary"}
            message={`Inaktive Checklisten können nicht für Begehungen eingesetzt werden.${canEditChecklists ? " Sie können die Checkliste jedoch wieder auf aktiv setzen." : ""}`}
            sx={{ width: "100%" }}
          />
        ))}
      {version.isCoreChecklist && !canEditCoreChecklists && (
        <Alert
          color={"primary"}
          message={`${!version.context.expandable ? "Exklusive " : ""}Kern-Checklisten können nur vom Landesamt erstellt werden.`}
          sx={{ width: "100%" }}
        />
      )}
    </>
  );
}
