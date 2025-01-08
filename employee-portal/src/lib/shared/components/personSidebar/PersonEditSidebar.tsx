/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useUpdateReferencePerson } from "@/lib/baseModule/api/mutations/person";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
} from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import {
  PersonSidebarForm,
  PersonSidebarFormProps,
} from "@/lib/shared/components/personSidebar/form/PersonSidebarForm";
import { mapToPersonUpdateRequest } from "@/lib/shared/components/personSidebar/helpers";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export interface PersonEditSidebarProps<TValues>
  extends PersonSidebarFormProps<TValues> {
  open: boolean;
}

export function PersonEditSidebar<TValues extends DefaultPersonFormValues>({
  open,
  ...props
}: PersonEditSidebarProps<TValues>) {
  return (
    <Sidebar open={open} onClose={props.onCancel}>
      <PersonSidebarForm {...props} mode={"edit"} />
    </Sidebar>
  );
}

type EditReferencePersonFormValues = DefaultPersonFormValues & {
  id: string;
  version: number;
};
type EditReferencePersonSidebarProps = SidebarWithFormRefProps &
  Omit<
    PersonEditSidebarProps<EditReferencePersonFormValues>,
    "onSubmit" | "onCancel" | "onBack" | "open" | "sidebarFormRef" | "component"
  >;

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

export function useEditReferencePersonSidebar() {
  return useSidebarWithFormRef({
    component: EditReferencePersonSidebar,
  });
}
