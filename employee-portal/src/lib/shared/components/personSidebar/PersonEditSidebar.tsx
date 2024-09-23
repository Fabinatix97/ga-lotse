/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultPersonFormValues } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import {
  PersonSidebarForm,
  PersonSidebarFormProps,
} from "@/lib/shared/components/personSidebar/form/PersonSidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";

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
