/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";

import { ApiLabel } from "@eshg/base-api";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { mapAddResourceRequest } from "@/lib/baseModule/api/mapper/resources";
import { useAddResource } from "@/lib/baseModule/api/mutations/resources";
import {
  ResourceForm,
  ResourceFormValues,
} from "@/lib/baseModule/components/resources/forms/ResourceForm";
import { routes } from "@/lib/baseModule/shared/routes";

const emptyValues: ResourceFormValues = {
  type: "",
  name: "",
  articleNumber: "",
  description: "",
  labelNames: [],
};

interface AddResourceSidebarProps extends SidebarWithFormRefProps {
  labels: ApiLabel[];
}

export function useAddResourceSidebar() {
  return useSidebarWithFormRef({
    component: AddResourceSidebar,
  });
}

function AddResourceSidebar(props: AddResourceSidebarProps) {
  const router = useRouter();
  const createResource = useAddResource();

  async function handleSubmit(values: ResourceFormValues) {
    await createResource.mutateAsync(mapAddResourceRequest(values), {
      onSuccess: ({ id }) => router.push(routes.resources.details(id)),
    });
  }

  return (
    <ResourceForm
      initialValues={emptyValues}
      labels={props.labels}
      formRef={props.formRef}
      title="Ressource hinzufügen"
      submitLabel="Hinzufügen"
      canChooseType
      onCancel={() => props.onClose(false)}
      onSubmit={handleSubmit}
    />
  );
}
