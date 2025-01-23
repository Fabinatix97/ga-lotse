/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import AddIcon from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/joy";
import { useState } from "react";

import { useGetInventoryItem } from "@/lib/baseModule/api/queries/inventory";
import { InventoryBooking } from "@/lib/baseModule/components/inventory/InventoryBooking";
import { InventoryDetails } from "@/lib/baseModule/components/inventory/InventoryDetails";
import { useInventoryRestockSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryRestockSidebar";
import { routes } from "@/lib/baseModule/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export default function InventoryDetailsPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const hasWritePerms = useHasUserRoleCheck(
    ApiUserRole.BaseInventoryAdministrate,
  );

  const [bookingHistoryPage, setBookingHistoryPage] = useState(0);

  const [
    {
      data: { item, labels },
    },
    { data: history },
  ] = useGetInventoryItem(params.id, bookingHistoryPage);

  const inventoryRestockSidebar = useInventoryRestockSidebar();

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title={item.name} backHref={routes.inventory.index} />}
    >
      <MainContentLayout>
        <Stack gap={2}>
          {hasWritePerms && (
            <Stack direction={"row"} justifyContent={"flex-end"}>
              <Button
                startDecorator={<AddIcon />}
                sx={{ width: "fit-content" }}
                onClick={() =>
                  inventoryRestockSidebar.open({
                    id: item.id,
                    minCount: item.minCount,
                  })
                }
              >
                Inventar auffüllen
              </Button>
            </Stack>
          )}
          <Stack
            gap={4}
            direction={{
              xxs: "column",
              md: "row",
            }}
          >
            <InventoryDetails
              inventory={item}
              labels={labels.elements}
              hasWritePerms={hasWritePerms}
            />

            <InventoryBooking
              history={history}
              currentPage={bookingHistoryPage}
              onChangePage={setBookingHistoryPage}
            />
          </Stack>
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
