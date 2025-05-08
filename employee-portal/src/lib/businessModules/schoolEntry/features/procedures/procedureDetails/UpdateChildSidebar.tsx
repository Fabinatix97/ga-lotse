/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DefaultPersonForm,
  DefaultPersonFormValues,
  PersonSidebarForm,
  SidebarWithFormRefProps,
  mapToPersonUpdateRequest,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import {
  PersonDetails,
  mapPersonDetailsToForm,
} from "@/lib/businessModules/schoolEntry/api/models/Person";
import { useUpdateChild } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";

export function useUpdateChildSidebar() {
  return useSidebarWithFormRef({
    component: UpdateChildSidebar,
  });
}

interface UpdateChildSidebarProps extends SidebarWithFormRefProps {
  child: PersonDetails;
  procedureId: string;
}

function UpdateChildSidebar({
  child,
  procedureId,
  onClose,
  formRef,
}: UpdateChildSidebarProps) {
  const updateChild = useUpdateChild(procedureId);

  async function handleSubmit(values: DefaultPersonFormValues) {
    const request = mapToPersonUpdateRequest(values, child.version);
    await updateChild.mutateAsync(
      {
        procedureId,
        apiUpdatePersonRequest: request,
      },
      {
        onSuccess: () => onClose(true),
      },
    );
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="Kind bearbeiten"
      initialValues={mapPersonDetailsToForm(child)}
      component={DefaultPersonForm}
      sidebarFormRef={formRef}
      addressRequired
      onCancel={() => onClose(false)}
      onSubmit={handleSubmit}
    />
  );
}
