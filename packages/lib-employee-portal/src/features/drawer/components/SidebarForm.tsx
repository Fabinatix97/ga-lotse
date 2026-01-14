/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import ModalDialogVariantColorContext from "@mui/joy/ModalDialog/ModalDialogVariantColorContext";
import { useFormikContext } from "formik";
import {
  FormHTMLAttributes,
  Ref,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
} from "react";

import {
  FormPlus,
  RequiresChildren,
  useResetAlertContext,
} from "@eshg/lib-portal";

import { SidebarFormHandle } from "../types/sidebar";

export type SidebarFormProps = FormHTMLAttributes<HTMLFormElement> &
  RequiresChildren;

export const SidebarForm = forwardRef<SidebarFormHandle, SidebarFormProps>(
  function SidebarForm(props: SidebarFormProps, ref) {
    const { dirty, resetForm: formikResetForm } = useFormikContext();
    const context = useContext(ModalDialogVariantColorContext);

    useSidebarFormHandle(ref, {
      dirty,
      resetForm: formikResetForm,
    });

    return (
      <FormPlus
        role="form"
        aria-labelledby={props["aria-labelledby"] ?? context?.labelledBy}
        {...props}
        sx={{ display: "contents" }}
      />
    );
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
