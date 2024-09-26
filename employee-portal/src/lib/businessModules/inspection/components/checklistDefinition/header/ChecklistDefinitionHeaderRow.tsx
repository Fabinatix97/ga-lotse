/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiUser } from "@eshg/employee-portal-api/inspection";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import AddIcon from "@mui/icons-material/Add";
import { Stack, Typography } from "@mui/joy";

import { isUnknownUser } from "@/lib/businessModules/inspection/shared/isUnknownUser";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

interface ChecklistDefinitionHeaderRowProps {
  readOnlyMode: boolean;
  newestVersion: boolean;
  version?: number;
  modifiedBy?: ApiUser;
  defId?: string;
  versionId?: string;
  isCoreChecklist?: boolean;
  isSubmitting?: boolean;
  hasDraft?: boolean;
  onPublish(publish: boolean): void;
}

export function ChecklistDefinitionHeaderRow({
  readOnlyMode,
  newestVersion,
  version,
  modifiedBy,
  defId,
  versionId,
  isCoreChecklist,
  isSubmitting = false,
  hasDraft,
  onPublish,
}: Readonly<ChecklistDefinitionHeaderRowProps>) {
  const [canEditChecklists, canEditCoreChecklists] = useHasUserRolesCheck([
    ApiUserRole.InspectionChecklistdefinitionsWrite,
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
  ]);
  const canSeeSaveActions =
    canEditChecklists && (canEditCoreChecklists || !isCoreChecklist);
  const canCreateNewVersion =
    newestVersion && !!defId && !!versionId && !hasDraft;

  const versionLabel = (version ?? 0) + (readOnlyMode || hasDraft ? 0 : 1);

  const newVersionUrl = routes.checklists.definitions.newVersion(
    defId!,
    versionId!,
  );

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent={version ? "space-between" : "flex-end"}
    >
      {version && <Typography>Version {versionLabel}</Typography>}

      {modifiedBy && !isUnknownUser(modifiedBy) && (
        <Typography>
          Zuletzt bearbeitet: <UserLink user={modifiedBy} />
        </Typography>
      )}

      {canSeeSaveActions &&
        (readOnlyMode ? (
          <InternalLinkButton
            disabled={!canCreateNewVersion}
            href={newVersionUrl}
            variant="plain"
            startDecorator={<AddIcon />}
          >
            Neue Version anlegen
          </InternalLinkButton>
        ) : (
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <SubmitButton
              key="draft"
              variant="outlined"
              submitting={isSubmitting}
              onClick={() => onPublish(false)}
            >
              Als Entwurf speichern
            </SubmitButton>
            <SubmitButton
              key="publish"
              submitting={isSubmitting}
              onClick={() => onPublish(true)}
            >
              Checkliste veröffentlichen
            </SubmitButton>
          </Stack>
        ))}
    </Stack>
  );
}
