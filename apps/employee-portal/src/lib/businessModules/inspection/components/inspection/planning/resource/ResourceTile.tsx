/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import type {
  ApiInspectionAppointment,
  ApiInspectionResource,
  ApiInspectionTravelTime,
} from "@eshg/inspection-api";

import { useResourceSidebar } from "@/lib/businessModules/inspection/components/inspection/planning/resource/ResourceSidebar";
import { ResourcesTable } from "@/lib/businessModules/inspection/components/inspection/planning/resource/ResourcesTable";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

interface ResourceTileProps {
  readonly?: boolean;
  procedureId: string;
  inspectionResources: ApiInspectionResource[];
  plannedAppointment?: ApiInspectionAppointment;
  standardBufferTime?: number;
  travelTime?: ApiInspectionTravelTime;
}

export function ResourceTile({
  readonly,
  procedureId,
  inspectionResources,
  plannedAppointment,
  standardBufferTime,
  travelTime,
}: Readonly<ResourceTileProps>) {
  const sidebar = useResourceSidebar();

  function openSidebar() {
    sidebar.open({
      procedureId,
      plannedAppointment,
      standardBufferTime,
      travelTime,
    });
  }

  return (
    <InfoTile
      name="resource-header"
      title="Ressourcen"
      footer={
        !readonly && (
          <InfoTileAddButton onClick={openSidebar}>
            Ressource hinzufügen
          </InfoTileAddButton>
        )
      }
    >
      {inspectionResources.length > 0 && (
        <ResourcesTable
          readonly={readonly}
          data={inspectionResources}
          procedureId={procedureId}
        />
      )}
    </InfoTile>
  );
}
