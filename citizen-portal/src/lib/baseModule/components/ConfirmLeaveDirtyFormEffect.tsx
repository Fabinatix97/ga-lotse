/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { useEffect } from "react";

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { MutationBundle } from "@eshg/lib-portal/types/query";

import {
  SettableConfirmationDialogOptions,
  useConfirmNavigation,
} from "./ConfirmNavigationProvider";

function onLeave(e: BeforeUnloadEvent) {
  e.preventDefault();
}

function useBeforeUnloadEffect(dirty: boolean) {
  useEffect(() => {
    if (!dirty) {
      return;
    }
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);
}

function useConfirmLeaveDirtyFormEffect({
  saveMutation,
  isDirty,
  ...options
}: ConfirmLeaveDirtyFormEffectProps) {
  const { dirty: formikDirty } = useFormikContext();
  const { setCanNavigate, setOnBeforeNavigateProps } = useNavigation();
  const dirty = isDirty ?? formikDirty;

  useConfirmNavigation(options);
  useBeforeUnloadEffect(dirty);
  useEffect(() => {
    setCanNavigate(!dirty);
    return () => setCanNavigate((can) => (can === false && dirty ? true : can));
  }, [dirty, setCanNavigate]);
  useEffect(() => {
    if (saveMutation) {
      setOnBeforeNavigateProps({ onSaveMutation: saveMutation });
    }
  }, [saveMutation, setOnBeforeNavigateProps]);
}

export interface ConfirmLeaveDirtyFormEffectProps
  extends SettableConfirmationDialogOptions {
  saveMutation?: MutationBundle;
  // Allow overriding using formik's dirty state
  isDirty?: boolean;
}

export function ConfirmLeaveDirtyFormEffect(
  options: ConfirmLeaveDirtyFormEffectProps,
) {
  useConfirmLeaveDirtyFormEffect(options);
  return null;
}
