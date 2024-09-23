/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { Ref } from "react";

import { useRestockInventoryItem } from "@/lib/baseModule/api/mutations/inventory";
import { InventoryRestockForm } from "@/lib/baseModule/components/inventory/forms/InventoryRestockForm";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";

interface InventoryRestockSidebarProps {
  id: string;
  minCount: number;
  onClose: () => void;
  onSuccess: () => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

export function InventoryRestockSidebar({
  sidebarFormRef,
  onClose,
  onSuccess,
  id,
  minCount,
}: InventoryRestockSidebarProps) {
  const restockInventory = useRestockInventoryItem(id);

  return (
    <InventoryRestockForm
      minCount={minCount}
      formRef={sidebarFormRef}
      onClose={onClose}
      onSubmit={async (values) => {
        await restockInventory
          .mutateAsync(mapRequiredValue(values.count), {
            onSuccess: onSuccess,
          })
          .catch();
      }}
    />
  );
}
