/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInventoryItem, ApiLabel } from "@eshg/employee-portal-api/base";
import { Ref } from "react";

import {
  mapInventoryItemToUpdateInventoryValues,
  mapUpdateInventoryItemRequest,
} from "@/lib/baseModule/api/mapper/inventory";
import { useUpdateInventoryItem } from "@/lib/baseModule/api/mutations/inventory";
import {
  InventoryForm,
  InventoryFormValues,
} from "@/lib/baseModule/components/inventory/forms/InventoryForm";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";

interface UpdateInventorySidebarProps {
  inventory: ApiInventoryItem;
  labels: ApiLabel[];
  onClose: () => void;
  onSuccess: () => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

export function InventoryUpdateSidebar({
  inventory,
  labels,
  onClose,
  onSuccess,
  sidebarFormRef,
}: UpdateInventorySidebarProps) {
  const updateInventory = useUpdateInventoryItem(inventory.id);

  async function handleSubmit(values: InventoryFormValues) {
    await updateInventory
      .mutateAsync(mapUpdateInventoryItemRequest(values), {
        onSuccess: onSuccess,
      })
      .catch();
  }

  return (
    <InventoryForm
      formRef={sidebarFormRef}
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
