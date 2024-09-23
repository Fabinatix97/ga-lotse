/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInventoryItem, ApiLabel } from "@eshg/employee-portal-api/base";
import { Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { LowCountWarning } from "@/lib/baseModule/components/inventory/LowCountWarning";
import { inventoryItemTypeNames } from "@/lib/baseModule/components/inventory/constants";
import { InventoryUpdateSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryUpdateSidebar";
import { LabelList } from "@/lib/baseModule/components/labels/LabelList";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

export function InventoryDetails({
  inventory,
  labels,
  hasWritePerms,
}: {
  inventory: ApiInventoryItem;
  labels: ApiLabel[];
  hasWritePerms: boolean;
}) {
  const [isUpdate, setUpdate] = useState(false);

  const { sidebarFormRef, closeSidebar, handleClose } = useSidebarForm({
    onClose: () => setUpdate(false),
  });

  return (
    <Sheet sx={{ flex: 1, padding: 3 }}>
      <Stack
        data-testid="inventory-details"
        aria-labelledby="inventory-details-header"
        component="section"
        gap={1}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography
            id={"inventory-details-header"}
            level={"h4"}
            component={"h2"}
          >
            Details
          </Typography>
          {hasWritePerms && (
            <EditButton
              aria-label={"Details ändern"}
              onClick={() => setUpdate(true)}
            />
          )}
        </Stack>

        <DetailsCell name={"name"} label="Name" value={inventory.name} />

        <DetailsCell
          name={"type"}
          label="Typ"
          value={inventoryItemTypeNames[inventory.type]}
        />

        <DetailsRow>
          {inventory.count < inventory.minCount ? (
            <DetailsCell
              name="minCount"
              label="Mindestbestand"
              value={
                <Stack direction={"row"} gap={1}>
                  <LowCountWarning visible={true} />
                  <Typography level={"title-md"}>
                    {inventory.minCount}
                  </Typography>
                </Stack>
              }
            />
          ) : (
            <DetailsCell
              name={"minCount"}
              label="Mindestbestand"
              value={inventory.minCount.toString()}
            />
          )}
          <DetailsCell
            name={"count"}
            label="Bestand"
            value={inventory.count.toString()}
          />
        </DetailsRow>

        <DetailsCell
          name={"articleNumber"}
          label={"Artikelnummer"}
          value={inventory.articleNumber ?? ""}
        />
        {inventory.labels.length > 0 && (
          <DetailsCell
            name={"labels"}
            label={"Labels"}
            value={<LabelList labels={inventory.labels} maxVisible={3} />}
          />
        )}
        <DetailsCell
          name={"description"}
          label={"Beschreibung"}
          value={inventory.description ?? ""}
        />
      </Stack>

      {hasWritePerms && (
        <OverlayBoundary>
          <Sidebar open={isUpdate} onClose={handleClose}>
            <InventoryUpdateSidebar
              inventory={inventory}
              labels={labels}
              onClose={handleClose}
              onSuccess={closeSidebar}
              sidebarFormRef={sidebarFormRef}
            />
          </Sidebar>
        </OverlayBoundary>
      )}
    </Sheet>
  );
}
