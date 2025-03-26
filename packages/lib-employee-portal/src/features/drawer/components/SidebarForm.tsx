/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { useFormikContext } from "formik";
import {
  FormHTMLAttributes,
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";

import { SidebarFormHandle } from "@/features/drawer/types/sidebar";

export type SidebarFormProps = FormHTMLAttributes<HTMLFormElement> &
  RequiresChildren;

export const SidebarForm = forwardRef<SidebarFormHandle, SidebarFormProps>(
  function SidebarForm(props: SidebarFormProps, ref) {
    const { dirty, resetForm: formikResetForm } = useFormikContext();

    useSidebarFormHandle(ref, {
      dirty,
      resetForm: formikResetForm,
    });

    return <FormPlus {...props} sx={{ display: "contents" }} />;
  },
);

// Exposes the dirty state (and the resetForm function) to the ref handle,
// so that outer components can evaluate it.
export function useSidebarFormHandle(
  ref: Ref<SidebarFormHandle>,
  props: {
    dirty: boolean;
    resetForm: () => void;
  },
) {
  const resetAlertContext = useResetAlertContext();

  const resetForm = useCallback(() => {
    props.resetForm();
    resetAlertContext();
  }, [props, resetAlertContext]);

  useImperativeHandle(ref, () => ({
    dirty: props.dirty,
    resetForm,
    resetErrors: resetAlertContext,
  }));
}
