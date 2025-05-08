/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useState } from "react";

import { ApiInspectionInventory } from "@eshg/inspection-api";

import { InventorySidebar } from "@/lib/businessModules/inspection/components/inspection/planning/inventory/InventorySidebar";
import { InventoryTable } from "@/lib/businessModules/inspection/components/inspection/planning/inventory/InventoryTable";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

interface InventoryTileProps {
  readonly?: boolean;
  procedureId: string;
  inspectionInventories: ApiInspectionInventory[];
}

export function InventoryTile({
  readonly,
  procedureId,
  inspectionInventories,
}: Readonly<InventoryTileProps>) {
  const [open, setOpen] = useState(false);

  return (
    <InfoTile
      name="inventory-header"
      title="Inventar"
      footer={
        !readonly && (
          <InfoTileAddButton onClick={() => setOpen(true)}>
            Inventar hinzufügen
          </InfoTileAddButton>
        )
      }
    >
      {inspectionInventories.length > 0 && (
        <InventoryTable
          readonly={readonly}
          procedureId={procedureId}
          inspectionInventories={inspectionInventories}
        />
      )}

      {open && (
        <InventorySidebar
          open
          procedureId={procedureId}
          onClose={() => setOpen(false)}
        />
      )}
    </InfoTile>
  );
}
