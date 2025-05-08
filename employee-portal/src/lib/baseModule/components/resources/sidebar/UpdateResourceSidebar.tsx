/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLabel, ApiResource } from "@eshg/base-api";
import {
  SidebarWithFormRefProps,
  useConfirmationDialog,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { mapUpdateResourceRequest } from "@/lib/baseModule/api/mapper/resources";
import { useUpdateResource } from "@/lib/baseModule/api/mutations/resources";
import {
  ResourceForm,
  ResourceFormValues,
} from "@/lib/baseModule/components/resources/forms/ResourceForm";

interface UpdateResourceSidebarProps extends SidebarWithFormRefProps {
  labels: ApiLabel[];
  resource: ApiResource;
}

export function useUpdateResourceSidebar() {
  return useSidebarWithFormRef({
    component: UpdateResourceSidebar,
  });
}

function UpdateResourceSidebar(props: UpdateResourceSidebarProps) {
  const saveDataOverview = useUpdateResource(props.resource.id);
  const { openConfirmationDialog } = useConfirmationDialog();

  function handleSubmit(values: ResourceFormValues) {
    openConfirmationDialog({
      onConfirm: () => {
        saveDataOverview.mutate(mapUpdateResourceRequest(values), {
          onSuccess: () => props.onClose(true),
        });
      },
    });
    return Promise.resolve();
  }

  return (
    <ResourceForm
      formRef={props.formRef}
      title="Ressource bearbeiten"
      submitLabel="Speichern"
      labels={props.labels}
      initialValues={{
        name: props.resource.name,
        labelNames: props.resource.labels.map((label) => label.name),
        articleNumber: props.resource.articleNumber ?? "",
        description: props.resource.description ?? "",
        type: props.resource.type,
      }}
      onSubmit={handleSubmit}
      onCancel={() => props.onClose(false)}
    />
  );
}
