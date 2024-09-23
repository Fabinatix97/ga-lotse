/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { NavigationContextProvider } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { useConfirmationDialog } from "./ConfirmationDialogProvider";

export function ConfirmNavigationProvider({ children }: RequiresChildren) {
  const { openConfirmationDialog } = useConfirmationDialog();
  function onBeforeNavigate(onConfirm: () => void) {
    openConfirmationDialog({
      onConfirm,
      title: "Änderungen verwerfen?",
      color: "danger",
      description:
        "Sie haben ungespeicherte Änderungen. Möchten Sie diese verwerfen?",
      confirmLabel: "Verwerfen",
      cancelLabel: "Abbrechen",
    });
  }

  return (
    <NavigationContextProvider onBeforeNavigate={onBeforeNavigate}>
      {children}
    </NavigationContextProvider>
  );
}
