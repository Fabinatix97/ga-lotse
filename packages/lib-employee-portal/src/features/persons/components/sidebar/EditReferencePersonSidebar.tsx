/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/features/drawer/hooks/useSidebarWithFormRef";
import { useUpdateReferencePerson } from "@/features/persons/api/mutations";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
} from "@/features/persons/components/form/DefaultPersonForm";
import {
  PersonSidebarForm,
  PersonSidebarFormProps,
} from "@/features/persons/components/form/PersonSidebarForm";
import { mapToPersonUpdateRequest } from "@/features/persons/utils/mappers";

interface EditReferencePersonFormValues extends DefaultPersonFormValues {
  id: string;
  version: number;
}

interface EditReferencePersonSidebarProps
  extends SidebarWithFormRefProps,
    Omit<
      PersonSidebarFormProps<EditReferencePersonFormValues>,
      | "onSubmit"
      | "onCancel"
      | "onBack"
      | "open"
      | "sidebarFormRef"
      | "component"
    > {}

function EditReferencePersonSidebar(props: EditReferencePersonSidebarProps) {
  const updateReferencePerson = useUpdateReferencePerson();

  async function onSubmit(values: EditReferencePersonFormValues) {
    await updateReferencePerson.mutateAsync(
      {
        id: values.id,
        request: {
          personDetails: mapToPersonUpdateRequest(values, values.version),
          version: values.version,
        },
      },
      {
        onSuccess: () => props.onClose(true),
      },
    );
  }

  return (
    <PersonSidebarForm
      {...props}
      mode={"edit"}
      onCancel={() => props.onClose(false)}
      onSubmit={onSubmit}
      sidebarFormRef={props.formRef}
      component={DefaultPersonForm}
    />
  );
}

export function useEditReferencePersonSidebar(): UseSidebarWithFormRefResult<EditReferencePersonSidebarProps> {
  return useSidebarWithFormRef({
    component: EditReferencePersonSidebar,
  });
}
