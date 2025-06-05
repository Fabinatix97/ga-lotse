/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import { ApiInspectionCLDVersion } from "@eshg/inspection-api";
import {
  OverlayBoundary,
  Sidebar,
  SidebarContent,
} from "@eshg/lib-employee-portal";

import { useGetAvailableCLDVs } from "@/lib/businessModules/inspection/api/queries/inspection";
import { ChecklistSelectSidebarForm } from "@/lib/businessModules/inspection/components/inspection/planning/checklist/ChecklistSelectSidebarForm";

interface ChecklistSidebarProps {
  open: boolean;
  inspectionExternalId: string;
  withCoreVersions: boolean;
  currentSelectedNonCoreVersions: ApiInspectionCLDVersion[];
  onClose: () => void;
}

export function ChecklistSelectSidebar(props: Readonly<ChecklistSidebarProps>) {
  return (
    <OverlayBoundary>
      <ChecklistSelectSidebarWithQueries {...props} />
    </OverlayBoundary>
  );
}

function ChecklistSelectSidebarWithQueries({
  open,
  inspectionExternalId,
  withCoreVersions,
  currentSelectedNonCoreVersions,
  onClose,
}: Readonly<ChecklistSidebarProps>) {
  const { data: availableCLDVs } = useGetAvailableCLDVs(inspectionExternalId);

  const cldsAvailable =
    (withCoreVersions && availableCLDVs.coreVersions.length > 0) ||
    availableCLDVs.versions.length > 0;

  return (
    <Sidebar open={open} onClose={onClose}>
      {cldsAvailable ? (
        <ChecklistSelectSidebarForm
          inspectionExternalId={inspectionExternalId}
          availableCldvs={availableCLDVs}
          currentSelectedNonCoreVersions={currentSelectedNonCoreVersions}
          onClose={onClose}
        />
      ) : (
        <SidebarContent title="Checkliste auswählen">
          <Stack alignItems="center" mt={3}>
            <InfoOutlined sx={{ color: "neutral.500", fontSize: "xl4" }} />
            <Typography aria-label="Hinweis">
              Es sind keine weiteren Checklisten auswählbar.
            </Typography>
          </Stack>
        </SidebarContent>
      )}
    </Sidebar>
  );
}
