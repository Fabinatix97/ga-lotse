/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Hexagon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Stack, Typography } from "@mui/joy";

import { useGetChecklistDefinitionVersions } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

import { ChecklistVersionsTable } from "./ChecklistVersionsTable";

interface CreateChecklistVersionsSidebarProps {
  open: boolean;
  onClose: () => void;
  checklistDefinitionId: string;
}

export function ChecklistVersionsSidebar(
  props: CreateChecklistVersionsSidebarProps,
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
  checklistDefinitionId,
}: Readonly<CreateChecklistVersionsSidebarProps>) {
  const { data: versions } = useGetChecklistDefinitionVersions(
    checklistDefinitionId,
  );

  const [canEditChecklists, canEditCoreChecklists] = useHasUserRolesCheck([
    ApiUserRole.InspectionChecklistdefinitionsWrite,
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
  ]);
  const newestVersion = versions.find((v) => v.context.validTo === undefined);
  const canAddVersion =
    canEditChecklists &&
    (canEditCoreChecklists || !newestVersion?.isCoreChecklist);

  function handleClose() {
    onClose();
  }

  return (
    <Sidebar open={open} onClose={handleClose}>
      <SidebarContent title={"Versionen"}>
        <Typography
          level="h4"
          component="p"
          textColor={"text.secondary"}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={0.5}>
            {newestVersion?.isCoreChecklist && <Hexagon />}
            {newestVersion?.isCoreChecklist
              ? "Kerncheckliste"
              : "Checkliste"}: {newestVersion?.context.name ?? ""}
          </Stack>
        </Typography>
        {canAddVersion && (
          <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
            <InternalLinkButton
              href={routes.checklists.definitions.newVersion(
                newestVersion?.context.defId ?? "",
                newestVersion?.context.id ?? "",
              )}
              variant="plain"
              startDecorator={<AddIcon />}
            >
              Neue Version anlegen
            </InternalLinkButton>
          </Box>
        )}
        <ChecklistVersionsTable versions={versions} />
      </SidebarContent>
    </Sidebar>
  );
}
