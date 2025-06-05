/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { ApiInspectionIncident } from "@eshg/inspection-api";

import { IncidentSidebar } from "@/lib/businessModules/inspection/components/inspection/execution/incident/IncidentSidebar";
import { IncidentsTable } from "@/lib/businessModules/inspection/components/inspection/execution/incident/IncidentsTable";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

interface IncidentsPanelProps {
  procedureId: string;
  incidents: ApiInspectionIncident[];
  readOnly: boolean;
}

interface SidebarState {
  open: boolean;
  incident?: ApiInspectionIncident;
}

export function IncidentsPanel({
  procedureId,
  incidents,
  readOnly,
}: Readonly<IncidentsPanelProps>) {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    open: false,
  });

  return (
    <Stack spacing={2} sx={{ overflow: "hidden", display: "flex", flex: 1 }}>
      <Stack
        data-testid="incidentsPanel"
        boxShadow="sm"
        border="1px solid var(--neutral-outlined-border, #CDD7E1);"
        borderRadius={12}
        spacing={2}
        padding={3}
        sx={{
          overflow: "hidden",
          backgroundColor: "white",
          display: "flex",
        }}
      >
        <Box p={3} sx={{ backgroundColor: "#F0F4F8" }}>
          <Typography level="h3" component="p">
            Vorkommnisse
          </Typography>
        </Box>

        {incidents.length > 0 && (
          <IncidentsTable
            incidents={incidents}
            readOnly={readOnly}
            onEdit={(incident) => setSidebarState({ open: true, incident })}
          />
        )}

        {!readOnly && (
          <InfoTileAddButton onClick={() => setSidebarState({ open: true })}>
            Vorkommnis hinzufügen
          </InfoTileAddButton>
        )}

        {sidebarState.open && (
          <IncidentSidebar
            open
            procedureId={procedureId}
            incident={sidebarState.incident}
            onClose={() => setSidebarState({ open: false })}
          />
        )}
      </Stack>
    </Stack>
  );
}
