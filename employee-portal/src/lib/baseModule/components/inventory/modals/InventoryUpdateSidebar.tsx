/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInventoryItem, ApiLabel } from "@eshg/base-api";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import {
  mapInventoryItemToUpdateInventoryValues,
  mapUpdateInventoryItemRequest,
} from "@/lib/baseModule/api/mapper/inventory";
import { useUpdateInventoryItem } from "@/lib/baseModule/api/mutations/inventory";
import {
  InventoryForm,
  InventoryFormValues,
} from "@/lib/baseModule/components/inventory/forms/InventoryForm";

export function useInventoryUpdateSidebar(): UseSidebarWithFormRefResult<UpdateInventorySidebarProps> {
  return useSidebarWithFormRef({
    component: InventoryUpdateSidebar,
  });
}

interface UpdateInventorySidebarProps extends SidebarWithFormRefProps {
  inventory: ApiInventoryItem;
  labels: ApiLabel[];
}

function InventoryUpdateSidebar({
  inventory,
  labels,
  onClose,
  formRef,
}: UpdateInventorySidebarProps) {
  const updateInventory = useUpdateInventoryItem(inventory.id);

  async function handleSubmit(values: InventoryFormValues) {
    await updateInventory.mutateAsync(mapUpdateInventoryItemRequest(values), {
      onSuccess: () => onClose(true),
    });
  }

  return (
    <InventoryForm
      formRef={formRef}
      initialValues={mapInventoryItemToUpdateInventoryValues(inventory)}
      labels={labels}
      title={"Inventar ändern"}
      submitLabel={"Speichern"}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
      onCancel={onClose}
    />
  );
}
