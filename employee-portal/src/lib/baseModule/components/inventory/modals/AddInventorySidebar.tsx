/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLabel } from "@eshg/employee-portal-api/base";
import { useRouter } from "next/navigation";

import { mapAddInventoryItemRequest } from "@/lib/baseModule/api/mapper/inventory";
import { useAddInventoryItem } from "@/lib/baseModule/api/mutations/inventory";
import {
  InventoryForm,
  InventoryFormValues,
} from "@/lib/baseModule/components/inventory/forms/InventoryForm";
import { routes } from "@/lib/baseModule/shared/routes";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useAddInventorySidebar(): UseSidebarWithFormRefResult<AddInventorySidebarProps> {
  return useSidebarWithFormRef({
    component: AddInventorySidebar,
  });
}

interface AddInventorySidebarProps extends SidebarWithFormRefProps {
  labels: ApiLabel[];
}

const initialInventoryFormValues: InventoryFormValues = {
  type: "",
  name: "",
  minCount: "",
  articleNumber: "",
  description: "",
  labelNames: [],
};

function AddInventorySidebar(props: AddInventorySidebarProps) {
  const router = useRouter();
  const createInventory = useAddInventoryItem();

  async function handleSubmit(values: InventoryFormValues) {
    await createInventory.mutateAsync(mapAddInventoryItemRequest(values), {
      onSuccess: (item) => {
        props.onClose(true);
        router.push(routes.inventory.details(item.id));
      },
    });
  }

  return (
    <InventoryForm
      initialValues={initialInventoryFormValues}
      labels={props.labels}
      formRef={props.formRef}
      onCancel={props.onClose}
      onSubmit={handleSubmit}
      title={"Inventar hinzufügen"}
      submitLabel={"Hinzufügen"}
    />
  );
}
