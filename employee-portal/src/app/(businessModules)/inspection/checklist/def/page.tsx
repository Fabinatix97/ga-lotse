/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/joy";

import { useGetChecklistDefinitions } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { ChecklistDefinitionOverviewTable } from "@/lib/businessModules/inspection/components/checklistDefinition/overview/ChecklistDefinitionOverviewTable";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export default function ChecklistOverview() {
  const canWrite = useHasUserRoleCheck(
    ApiUserRole.InspectionChecklistdefinitionsWrite,
  );
  const { data: checklists, isFetching } = useGetChecklistDefinitions();

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Checklistendefinitionen" />}>
      <MainContentLayout fullViewportHeight>
        {canWrite && (
          <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }} gap={2}>
            <InternalLinkButton
              href={routes.checklists.definitions.new}
              startDecorator={<AddIcon />}
            >
              Neue Definition anlegen
            </InternalLinkButton>
          </Box>
        )}
        <ChecklistDefinitionOverviewTable
          checklists={checklists}
          isFetching={isFetching}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
