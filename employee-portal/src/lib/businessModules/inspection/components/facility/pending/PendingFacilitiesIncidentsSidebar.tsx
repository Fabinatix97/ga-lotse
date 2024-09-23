/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionIncident } from "@eshg/employee-portal-api/inspection";
import { Sheet, Stack, Typography } from "@mui/joy";

import { useGetIncidents } from "@/lib/businessModules/inspection/api/queries/incidents";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface PendingFacilitiesIncidentsSidebarProps {
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
            <IncidentTile incident={incident} key={incident.incidentId} />
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
          <Typography component={"b"}>
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
            <Typography>{incident.description}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Sheet>
  );
}
