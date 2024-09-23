/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLabel } from "@eshg/employee-portal-api/base";
import { useRouter } from "next/navigation";
import { Ref } from "react";

import { mapAddInventoryItemRequest } from "@/lib/baseModule/api/mapper/inventory";
import { useAddInventoryItem } from "@/lib/baseModule/api/mutations/inventory";
import {
  InventoryForm,
  InventoryFormValues,
} from "@/lib/baseModule/components/inventory/forms/InventoryForm";
import { routes } from "@/lib/baseModule/shared/routes";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";

interface AddInventorySidebarProps {
  labels: ApiLabel[];
  onClose: () => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

const initialInventoryFormValues: InventoryFormValues = {
  type: "",
  name: "",
  minCount: "",
  articleNumber: "",
  description: "",
  labelNames: [],
};

export function AddInventorySidebar(props: AddInventorySidebarProps) {
  const router = useRouter();
  const createInventory = useAddInventoryItem();

  async function handleSubmit(values: InventoryFormValues) {
    await createInventory
      .mutateAsync(mapAddInventoryItemRequest(values), {
        onSuccess: (item) => router.push(routes.inventory.details(item.id)),
      })
      .catch();
  }

  return (
    <InventoryForm
      initialValues={initialInventoryFormValues}
      labels={props.labels}
      formRef={props.sidebarFormRef}
      onCancel={props.onClose}
      onSubmit={handleSubmit}
      title={"Inventar hinzufügen"}
      submitLabel={"Hinzufügen"}
    />
  );
}
