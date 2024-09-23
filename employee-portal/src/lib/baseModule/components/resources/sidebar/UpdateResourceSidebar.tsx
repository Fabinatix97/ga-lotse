/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLabel, ApiResource } from "@eshg/employee-portal-api/base";
import { Ref } from "react";

import { mapUpdateResourceRequest } from "@/lib/baseModule/api/mapper/resources";
import { useUpdateResource } from "@/lib/baseModule/api/mutations/resources";
import {
  ResourceForm,
  ResourceFormValues,
} from "@/lib/baseModule/components/resources/forms/ResourceForm";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";

interface UpdateResourceSidebarProps {
  onClose: () => void;
  onSave: () => void;
  labels: ApiLabel[];
  resource: ApiResource;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

export function UpdateResourceSidebar(props: UpdateResourceSidebarProps) {
  const saveDataOverview = useUpdateResource(props.resource.id);
  const { openConfirmationDialog } = useConfirmationDialog();

  function handleSubmit(values: ResourceFormValues) {
    openConfirmationDialog({
      onConfirm: () => {
        saveDataOverview.mutate(mapUpdateResourceRequest(values), {
          onSuccess: props.onSave,
        });
      },
    });
    return Promise.resolve();
  }

  return (
    <ResourceForm
      formRef={props.sidebarFormRef}
      title={"Ressource bearbeiten"}
      submitLabel={"Speichern"}
      labels={props.labels}
      initialValues={{
        name: props.resource.name,
        labelNames: props.resource.labels.map((label) => label.name),
        articleNumber: props.resource.articleNumber ?? "",
        description: props.resource.description ?? "",
        type: props.resource.type,
      }}
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
