/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";

import { ApiInventoryItem, ApiLabel } from "@eshg/base-api";
import { DetailsItem, DetailsRow, EditButton } from "@eshg/lib-employee-portal";
import { DetailsList } from "@eshg/lib-portal";

import { LowCountWarning } from "@/lib/baseModule/components/inventory/LowCountWarning";
import { inventoryItemTypeNames } from "@/lib/baseModule/components/inventory/constants";
import { useInventoryUpdateSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryUpdateSidebar";
import { LabelList } from "@/lib/baseModule/components/labels/LabelList";

export function InventoryDetails({
  inventory,
  labels,
  hasWritePerms,
}: {
  inventory: ApiInventoryItem;
  labels: ApiLabel[];
  hasWritePerms: boolean;
}) {
  const inventoryUpdateSidebar = useInventoryUpdateSidebar();

  return (
    <Sheet sx={{ flex: 1, padding: 3 }}>
      <DetailsList>
        <Stack
          data-testid="inventory-details"
          aria-labelledby="inventory-details-header"
          component="section"
          gap={1}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography id="inventory-details-header" level="h4" component="h2">
              Details
            </Typography>
            {hasWritePerms && (
              <EditButton
                aria-label="Details ändern"
                onClick={() =>
                  inventoryUpdateSidebar.open({
                    inventory,
                    labels,
                  })
                }
              />
            )}
          </Stack>

          <DetailsItem label="Name" value={inventory.name} />

          <DetailsItem
            label="Typ"
            value={inventoryItemTypeNames[inventory.type]}
          />

          <DetailsRow>
            {inventory.count < inventory.minCount ? (
              <DetailsItem
                label="Mindestbestand"
                value={
                  <Stack direction="row" gap={1}>
                    <LowCountWarning visible />
                    <Typography level="title-md">
                      {inventory.minCount}
                    </Typography>
                  </Stack>
                }
              />
            ) : (
              <DetailsItem
                label="Mindestbestand"
                value={inventory.minCount.toString()}
              />
            )}
            <DetailsItem label="Bestand" value={inventory.count.toString()} />
          </DetailsRow>

          <DetailsItem
            label="Artikelnummer"
            value={inventory.articleNumber ?? ""}
          />
          {inventory.labels.length > 0 && (
            <DetailsItem
              label="Labels"
              value={<LabelList labels={inventory.labels} maxVisible={3} />}
            />
          )}
          <DetailsItem
            label="Beschreibung"
            value={inventory.description ?? ""}
          />
        </Stack>
      </DetailsList>
    </Sheet>
  );
}
