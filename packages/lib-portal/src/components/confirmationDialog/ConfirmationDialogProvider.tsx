/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from "react";

import { Optional } from "../../types/utility";
import { ErrorModalProps } from "../boundaries/BaseErrorModal";
import { BaseOverlayBoundary } from "../boundaries/BaseOverlayBoundary";

import { ConfirmationDialogProps } from "./BaseConfirmationDialog";

interface ConfirmationDialogContextValue {
  confirmationDialog: ConfirmationDialogProps | undefined;
  setConfirmationDialog: Dispatch<
    SetStateAction<ConfirmationDialogProps | undefined>
  >;
}

export const ConfirmationDialogContext =
  createContext<ConfirmationDialogContextValue | null>(null);

interface ConfirmationDialogProviderProps {
  component: (props: ConfirmationDialogProps) => ReactNode;
  children: ReactNode;
  errorModal: (props: ErrorModalProps) => ReactNode;
}

export function ConfirmationDialogProvider({
  component,
  children,
  errorModal,
}: ConfirmationDialogProviderProps) {
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialogProps>();
  const DialogComponent = component;
  const contextValue = useMemo<ConfirmationDialogContextValue>(
    () => ({ confirmationDialog, setConfirmationDialog }),
    [confirmationDialog, setConfirmationDialog],
  );

  return (
    <ConfirmationDialogContext value={contextValue}>
      {confirmationDialog && (
        <BaseOverlayBoundary fallbackErrorModal={errorModal}>
          <DialogComponent {...confirmationDialog} />
        </BaseOverlayBoundary>
      )}
      {children}
    </ConfirmationDialogContext>
  );
}

export type ConfirmationDialogOptions = Optional<
  Omit<ConfirmationDialogProps, "open">,
  "onClose"
>;
