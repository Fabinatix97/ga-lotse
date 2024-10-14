/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Optional } from "@eshg/lib-portal/types/utility";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
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

export type ConfirmationDialogOptions = Optional<
  Omit<ConfirmationDialogProps, "open">,
  "onClose"
>;

export function useConfirmationDialog() {
  const context = useContext(ConfirmationDialogContext);
  if (context === null) {
    throw new Error(
      "useConfirmationDialog was called outside ConfirmationDialogProvider",
    );
  }
  const { setConfirmationDialog } = context;

  return useMemo(() => {
    function openConfirmationDialog(options: ConfirmationDialogOptions) {
      setConfirmationDialog({
        ...options,
        open: true,
        onClose: () => {
          setConfirmationDialog(undefined);
          if (isDefined(options.onClose)) {
            options.onClose();
          }
        },
      });
    }

    function openCancelDialog(options: ConfirmationDialogOptions) {
      openConfirmationDialog({
        title: "Änderungen verwerfen?",
        description: "Möchten Sie die Änderungen wirklich verwerfen?",
        confirmLabel: "Verwerfen",
        color: "danger",
        ...options,
      });
    }

    return {
      openConfirmationDialog,
      openCancelDialog,
    };
  }, [setConfirmationDialog]);
}
