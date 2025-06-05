/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Stack, Typography } from "@mui/joy";

import { ApiInspectionIncident } from "@eshg/inspection-api";
import {
  OverlayBoundary,
  Sidebar,
  SidebarContent,
} from "@eshg/lib-employee-portal";

import { useGetIncidents } from "@/lib/businessModules/inspection/api/queries/incidents";

interface PendingFacilitiesIncidentsSidebarProps {
  open: boolean;
  onClose: () => void;
  inspectionId: string;
  facilityName: string;
}

export function PendingFacilitiesIncidentsSidebar(
  props: PendingFacilitiesIncidentsSidebarProps,
) {
  return (
    <OverlayBoundary>
      <PendingFacilitiesIncidentsSidebarWithQueriesAndMutations {...props} />
    </OverlayBoundary>
  );
}

function PendingFacilitiesIncidentsSidebarWithQueriesAndMutations({
  open,
  onClose,
  inspectionId,
  facilityName,
}: Readonly<PendingFacilitiesIncidentsSidebarProps>) {
  const { data: incidents } = useGetIncidents(inspectionId);

  return (
    <Sidebar open={open} onClose={onClose}>
      <SidebarContent title={`Vorkommnisse ${facilityName}`}>
        <Stack>
          {incidents.map((incident) => (
            <IncidentTile key={incident.incidentId} incident={incident} />
          ))}
        </Stack>
      </SidebarContent>
    </Sidebar>
  );
}

function IncidentTile({
  incident,
}: Readonly<{ incident: ApiInspectionIncident }>) {
  return (
    <Sheet variant="outlined" sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <Stack>
          <Typography component="b">
            <b>
              {incident.checklistNumber === undefined
                ? `${incident.title}`
                : `Checkliste ${incident.checklistNumber}: ${incident.sectionNumber}.${incident.elementNumber}`}
            </b>
          </Typography>
        </Stack>
        <Stack>
          {incident.checklistNumber && (
            <Stack>
              <Typography>{incident.title}</Typography>
            </Stack>
          )}
          <Stack>
            <Typography
              whiteSpace="pre-line"
              sx={{ overflowWrap: "break-word" }}
            >
              {incident.description}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Sheet>
  );
}
