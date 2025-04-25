/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useNewFacilitySidebar } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/NewFacilitySidebar";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export function NewFacilityButton({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const newFacilitySidebar = useNewFacilitySidebar();

  return (
    <InfoTile title="Einrichtung" name="facility">
      <InfoTileAddButton
        onClick={() => newFacilitySidebar.open({ procedureId: procedureId })}
      >
        Hinzufügen
      </InfoTileAddButton>
    </InfoTile>
  );
}
