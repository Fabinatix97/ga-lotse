/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CopyAllOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";
import { useId } from "react";
import { isDefined } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import { ApiChecklistDefinitionVersion } from "@eshg/inspection-api";
import { DetailsItem, useHasUserRoleCheck } from "@eshg/lib-employee-portal";
import {
  Alert,
  DetailsColumn,
  DetailsList,
  InternalLinkButton,
  formatDateTime,
} from "@eshg/lib-portal";

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

  const titleId = useId();
  return (
    <Sheet component="section" aria-labelledby={titleId}>
      <Stack gap={2}>
        <Typography level="title-lg" component="h2" id={titleId}>
          Informationen zur Checklistendefinition
        </Typography>

        <DetailsList>
          <DetailsColumn>
            {cldVersion.isCoreChecklist && (
              <DetailsItem
                label="Checklistentyp"
                value={
                  <CLDInfoCardCoreChecklistLabel cldVersion={cldVersion} />
                }
              />
            )}
            <DetailsItem
              label="Version"
              value={
                `Lokal ${cldVersion.context.version}` +
                (!cldVersion.context.repositoryVersion
                  ? ""
                  : ", Remote " + cldVersion.context.repositoryVersion)
              }
            />
            {isDefined(cldVersion.objectType) && (
              <DetailsItem
                label="Objekttyp"
                value={cldVersion.objectType?.name}
              />
            )}
            <DetailsItem
              label="Veröffentlicht von"
              value={
                isDefined(cldVersion.modifiedBy) &&
                !isUnknownUser(cldVersion.modifiedBy) ? (
                  <UserLink user={cldVersion.modifiedBy} />
                ) : (
                  "Unbekannt"
                )
              }
            />
            {isDefined(cldVersion.context.lastModified) && (
              <DetailsItem
                label="Veröffentlicht am"
                value={
                  <time dateTime={modifiedDateIso}>{modifiedDateHuman}</time>
                }
              />
            )}
          </DetailsColumn>
        </DetailsList>
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
