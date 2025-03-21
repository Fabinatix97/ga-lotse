/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ChildDetails,
  mapPersonDetailsToForm,
  useUpdateAnnualChildPerson,
} from "@eshg/dental";
import {
  DefaultPersonFormValues,
  mapToPersonUpdateRequest,
} from "@eshg/lib-employee-portal";

import { DefaultPersonForm } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { PersonSidebarForm } from "@/lib/shared/components/personSidebar/form/PersonSidebarForm";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useUpdateAnnualChildPersonSidebar() {
  return useSidebarWithFormRef({
    component: UpdateAnnualChildPersonSidebar,
  });
}

interface UpdateAnnualChildPersonSidebarProps extends SidebarWithFormRefProps {
  child: ChildDetails;
  childId: string;
}

function UpdateAnnualChildPersonSidebar({
  child,
  childId,
  onClose,
  formRef,
}: UpdateAnnualChildPersonSidebarProps) {
  const updateChild = useUpdateAnnualChildPerson(childId);

  async function handleSubmit(values: DefaultPersonFormValues) {
    const request = mapToPersonUpdateRequest(values, child.version);
    await updateChild.mutateAsync(
      {
        childId: childId,
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
      onCancel={() => onClose(false)}
      onSubmit={handleSubmit}
      initialValues={mapPersonDetailsToForm(child)}
      component={DefaultPersonForm}
      sidebarFormRef={formRef}
      addressRequired
    />
  );
}
