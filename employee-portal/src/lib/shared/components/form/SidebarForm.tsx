/**
 * Copyright 2024 cronn GmbH
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

export type SidebarFormProps = FormHTMLAttributes<HTMLFormElement> &
  RequiresChildren;

/**
 * A handle that can be used to access the dirty state (and the resetForm
 * function) of the form from outside components. Example:
 * ```
 *   const ref = useRef<SidebarFormHandle>(null);
 *
 *   function handleClose() {
 *     if (ref.current?.dirty)
 *       ref.current?.resetForm();
 *   }
 *
 *   <OuterComponent onClose={handleClose}>
 *     <SidebarForm ref={ref}> ... </SidebarForm>
 *   </OuterComponent>
 * ```
 */
export interface SidebarFormHandle {
  dirty: boolean;
  resetForm: () => void;
  resetErrors: () => void;
}

export const SidebarForm = forwardRef<SidebarFormHandle, SidebarFormProps>(
  function SidebarForm(props: SidebarFormProps, ref) {
    const { dirty, resetForm: formikResetForm } = useFormikContext();

    useSidebarFormHandle(ref, {
      dirty,
      resetForm: formikResetForm,
    });

    return <FormPlus {...props} style={{ display: "contents" }} />;
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
