/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";

import { useRestockInventoryItem } from "@/lib/baseModule/api/mutations/inventory";
import { InventoryRestockForm } from "@/lib/baseModule/components/inventory/forms/InventoryRestockForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useInventoryRestockSidebar(): UseSidebarWithFormRefResult<InventoryRestockSidebarProps> {
  return useSidebarWithFormRef({
    component: InventoryRestockSidebar,
  });
}

interface InventoryRestockSidebarProps extends SidebarWithFormRefProps {
  id: string;
  minCount: number;
}

function InventoryRestockSidebar({
  formRef,
  onClose,
  id,
  minCount,
}: InventoryRestockSidebarProps) {
  const restockInventory = useRestockInventoryItem(id);

  return (
    <InventoryRestockForm
      minCount={minCount}
      formRef={formRef}
      onClose={onClose}
      onSubmit={async (values) => {
        await restockInventory.mutateAsync(mapRequiredValue(values.count), {
          onSuccess: () => onClose(true),
        });
      }}
    />
  );
}
