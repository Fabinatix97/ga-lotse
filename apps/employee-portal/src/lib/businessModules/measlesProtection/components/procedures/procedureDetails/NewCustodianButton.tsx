/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useNewCustodianSidebar } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/NewCustodianSidebar";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export function NewCustodianButton({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const newCustodianSidebar = useNewCustodianSidebar();

  return (
    <InfoTile title="PSB - Personensorgeberechtigte:r" name="custodian">
      <InfoTileAddButton
        onClick={() => newCustodianSidebar.open({ procedureId: procedureId })}
      >
        Hinzufügen
      </InfoTileAddButton>
    </InfoTile>
  );
}
