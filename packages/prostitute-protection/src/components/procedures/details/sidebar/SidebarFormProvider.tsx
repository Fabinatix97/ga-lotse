/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik, FormikValues } from "formik";
import { PropsWithChildren } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
} from "@eshg/lib-employee-portal";

interface SidebarFormProviderProps<T>
  extends SidebarWithFormRefProps,
    PropsWithChildren {
  onSubmit: (values: T) => Promise<unknown> | void;
  initialValues: T & FormikValues;
  title: string;
}

export function SidebarFormProvider<T>({
  formRef,
  onClose,
  onSubmit,
  children,
  initialValues,
  title,
}: SidebarFormProviderProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title={title}>{children}</SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel="Speichern"
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
