/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CopyAllOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import { ApiChecklistDefinitionVersion } from "@eshg/inspection-api";
import { useHasUserRoleCheck } from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";

import {
  getIsNewestVersion,
  useUserCanSaveChecklistDefinition,
} from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";
import { CorechecklistIcon } from "@/lib/businessModules/inspection/components/icons/CorechecklistIcon";
import { ExclusiveCorechecklistIcon } from "@/lib/businessModules/inspection/components/icons/ExclusiveCorechecklistIcon";
import { isUnknownUser } from "@/lib/businessModules/inspection/shared/isUnknownUser";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { UserLink } from "@/lib/shared/components/users/UserLink";

export function CLDInfoCard({
  cldVersion,
}: Readonly<{
  cldVersion: ApiChecklistDefinitionVersion;
}>) {
  const canEditCoreChecklists = useHasUserRoleCheck(
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
  );

  const modifiedDateIso = cldVersion.context.lastModified?.toISOString();
  const modifiedDateHuman = formatDateTime(cldVersion.context.lastModified);

  const isNewestVersion = getIsNewestVersion(cldVersion);
  const canCreateNewVersion = useUserCanSaveChecklistDefinition(cldVersion);

  const newVersionUrl = routes.checklists.definitions.newVersion(
    cldVersion.context.defId,
    cldVersion.context.id,
  );

  return (
    <Sheet component="section" aria-label="Checklistdefinition Informationen">
      <Stack gap={2}>
        <Typography level="title-lg" aria-label="Checklistdefinition Name">
          {cldVersion.context.name}
        </Typography>
        <CLDInfoCardCoreChecklistLabel cldVersion={cldVersion} />
        <Typography>
          <span>Version: </span>
          <span>{`Lokal ${cldVersion.context.version}`}</span>
          {isDefined(cldVersion.context.repositoryVersion) && (
            <>
              <span>, </span>
              <span>{`Remote ${cldVersion.context.repositoryVersion}`}</span>
            </>
          )}
        </Typography>
        {isDefined(cldVersion.objectType) && (
          <Typography aria-label="Objekttyp">
            {cldVersion.objectType.name}
          </Typography>
        )}
        <Typography>
          <span>Veröffentlicht von </span>
          {isDefined(cldVersion.modifiedBy) &&
          !isUnknownUser(cldVersion.modifiedBy) ? (
            <UserLink user={cldVersion.modifiedBy} />
          ) : (
            <span>unbekannt</span>
          )}
          {isDefined(cldVersion.context.lastModified) && (
            <>
              <span> am </span>
              <time dateTime={modifiedDateIso}>{modifiedDateHuman}</time>
            </>
          )}
        </Typography>
        {cldVersion.isCoreChecklist && !cldVersion.context.expandable && (
          <Alert
            color="primary"
            sx={{ alignItems: "flex-start" }}
            message="Exklusive Kern-Checklisten sind nicht mit anderen Checklisten kombinierbar"
          />
        )}
        {cldVersion.isCoreChecklist && !canEditCoreChecklists && (
          <Alert
            color="primary"
            sx={{ alignItems: "flex-start" }}
            message="Sie können keine neuen Versionen von Kern-Checklisten anlegen."
          />
        )}
        {!isNewestVersion && (
          <Alert
            color="primary"
            sx={{ alignItems: "flex-start" }}
            message="Eine neue Version kann nur auf Basis der aktuellsten Version erstellt werden."
          />
        )}
        {canCreateNewVersion && (
          <InternalLinkButton
            href={newVersionUrl}
            startDecorator={<CopyAllOutlined />}
          >
            Für neue Version nutzen
          </InternalLinkButton>
        )}
      </Stack>
    </Sheet>
  );
}

export function CLDInfoCardCoreChecklistLabel({
  cldVersion,
}: Readonly<{
  cldVersion: ApiChecklistDefinitionVersion;
}>) {
  if (!cldVersion.isCoreChecklist) {
    return;
  }

  return cldVersion.context.expandable ? (
    <Typography startDecorator={<CorechecklistIcon size="sm" />}>
      Kern-Checkliste
    </Typography>
  ) : (
    <Typography startDecorator={<ExclusiveCorechecklistIcon size="sm" />}>
      Exklusive Kern-Checkliste
    </Typography>
  );
}
