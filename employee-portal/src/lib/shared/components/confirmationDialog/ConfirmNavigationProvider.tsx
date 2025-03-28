/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import {
  NavigationContextProvider,
  OnBeforeNavigateProps,
} from "@eshg/lib-portal/components/navigation/NavigationContext";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

const LABELS = {
  cancel: "Abbrechen",
  discard: "Verwerfen",
};

export function ConfirmNavigationProvider({ children }: RequiresChildren) {
  const { openConfirmationDialog } = useConfirmationDialog();

  function onBeforeNavigate(
    onNavigate: () => void,
    onBeforeNavigateProps?: OnBeforeNavigateProps,
  ) {
    if (onBeforeNavigateProps?.onSaveMutation !== undefined) {
      openConfirmationDialog({
        onConfirmMutation: onBeforeNavigateProps?.onSaveMutation,
        onDeny: onNavigate,
        title: "Änderungen speichern?",
        color: "primary",
        description:
          "Sie haben ungespeicherte Änderungen. Möchten Sie diese speichern?",
        confirmLabel: "Speichern",
        denyLabel: LABELS.discard,
        cancelLabel: LABELS.cancel,
        ...(onBeforeNavigateProps?.confirmationDialogProps ?? {}),
        onConfirm: onBeforeNavigateProps?.confirmationDialogProps?.onConfirm
          ? () =>
              onBeforeNavigateProps.confirmationDialogProps!.onConfirm!(
                onNavigate,
              )
          : onNavigate,
      });
    } else {
      openConfirmationDialog({
        onDeny: onNavigate,
        title: "Änderungen verwerfen?",
        color: "danger",
        description:
          "Sie haben ungespeicherte Änderungen. Möchten Sie diese verwerfen?",
        confirmLabel: LABELS.discard,
        cancelLabel: LABELS.cancel,
        ...(onBeforeNavigateProps?.confirmationDialogProps ?? {}),
        onConfirm: onBeforeNavigateProps?.confirmationDialogProps?.onConfirm
          ? () =>
              onBeforeNavigateProps.confirmationDialogProps!.onConfirm!(
                onNavigate,
              )
          : onNavigate,
      });
    }
  }

  return (
    <NavigationContextProvider onBeforeNavigate={onBeforeNavigate}>
      {children}
    </NavigationContextProvider>
  );
}
