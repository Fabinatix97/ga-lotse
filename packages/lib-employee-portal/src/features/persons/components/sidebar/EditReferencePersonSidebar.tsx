/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "../../../drawer/hooks/useSidebarWithFormRef";
import { useUpdateReferencePerson } from "../../api/mutations";
import { mapToPersonUpdateRequest } from "../../utils/mappers";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
} from "../form/DefaultPersonForm";
import {
  PersonSidebarForm,
  PersonSidebarFormProps,
} from "../form/PersonSidebarForm";

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
      mode="edit"
      sidebarFormRef={props.formRef}
      component={DefaultPersonForm}
      onCancel={() => props.onClose(false)}
      onSubmit={onSubmit}
    />
  );
}

export function useEditReferencePersonSidebar(): UseSidebarWithFormRefResult<EditReferencePersonSidebarProps> {
  return useSidebarWithFormRef({
    component: EditReferencePersonSidebar,
  });
}
