/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLabel } from "@eshg/employee-portal-api/base";
import { useRouter } from "next/navigation";

import { mapAddResourceRequest } from "@/lib/baseModule/api/mapper/resources";
import { useAddResource } from "@/lib/baseModule/api/mutations/resources";
import {
  ResourceForm,
  ResourceFormValues,
} from "@/lib/baseModule/components/resources/forms/ResourceForm";
import { routes } from "@/lib/baseModule/shared/routes";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

const emptyValues: ResourceFormValues = {
  type: "",
  name: "",
  articleNumber: "",
  description: "",
  labelNames: [],
};

interface AddResourceSidebarProps {
  open: boolean;
  onClose: () => void;
  labels: ApiLabel[];
}

export function AddResourceSidebar(props: AddResourceSidebarProps) {
  const router = useRouter();
  const createResource = useAddResource();

  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: props.onClose,
  });

  async function handleSubmit(values: ResourceFormValues) {
    await createResource
      .mutateAsync(mapAddResourceRequest(values), {
        onSuccess: ({ id }) => router.push(routes.resources.details(id)),
      })
      .catch();
  }

  return (
    <Sidebar open={props.open} onClose={handleClose}>
      <ResourceForm
        initialValues={emptyValues}
        labels={props.labels}
        formRef={sidebarFormRef}
        onCancel={handleClose}
        onSubmit={handleSubmit}
        title={"Ressource hinzufügen"}
        submitLabel={"Hinzufügen"}
        canChooseType
      />
    </Sidebar>
  );
}
