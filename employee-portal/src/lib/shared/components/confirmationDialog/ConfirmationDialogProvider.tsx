/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { isDefined } from "remeda";

import {
  ConfirmationDialog,
  ConfirmationDialogProps,
} from "./ConfirmationDialog";

const ConfirmationDialogContext = createContext<{
  confirmationDialog: ConfirmationDialogProps | undefined;
  setConfirmationDialog: Dispatch<
    SetStateAction<ConfirmationDialogProps | undefined>
  >;
}>(null!);

export function ConfirmationDialogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialogProps>();
  return (
    <ConfirmationDialogContext.Provider
      value={{ confirmationDialog, setConfirmationDialog }}
    >
      {confirmationDialog && <ConfirmationDialog {...confirmationDialog} />}
      {children}
    </ConfirmationDialogContext.Provider>
  );
}

export function useConfirmationDialog() {
  const context = useContext(ConfirmationDialogContext);
  if (context === null) {
    throw new Error(
      "useConfirmationDialog was called outside ConfirmationDialogProvider",
    );
  }

  const openConfirmationDialog = useCallback(
    (
      confirmationDialog: Omit<ConfirmationDialogProps, "open" | "onClose"> & {
        onClose?: ConfirmationDialogProps["onClose"];
      },
    ) => {
      context.setConfirmationDialog({
        ...confirmationDialog,
        open: true,
        onClose: () => {
          context.setConfirmationDialog(undefined);
          if (isDefined(confirmationDialog.onClose)) {
            confirmationDialog.onClose();
          }
        },
      });
    },
    [context],
  );

  const openCancelDialog = useCallback(
    (confirmationDialog: Omit<ConfirmationDialogProps, "open" | "onClose">) => {
      context.setConfirmationDialog({
        title: "Änderungen verwerfen?",
        description: "Möchten Sie die Änderungen wirklich verwerfen?",
        confirmLabel: "Verwerfen",
        color: "danger",
        ...confirmationDialog,
        open: true,
        onClose: () => context.setConfirmationDialog(undefined),
      });
    },
    [context],
  );
  return {
    openConfirmationDialog,
    openCancelDialog,
  };
}
