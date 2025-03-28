/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ConfirmationDialogOptions } from "@eshg/lib-portal/components/confirmationDialog/ConfirmationDialogProvider";
import {
  NavigationContextProvider,
  OnBeforeNavigateProps,
} from "@eshg/lib-portal/components/navigation/NavigationContext";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { isEmpty } from "remeda";

import { useTranslation } from "@/lib/i18n/client";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export type SettableConfirmationDialogOptions = Partial<
  Omit<ConfirmationDialogOptions, "onConfirmMutation" | "onDeny">
>;

interface ConfirmNavigationContextValue {
  registerConfirmationOptions: (
    registerConfirmationOptions: SettableConfirmationDialogOptions,
  ) => void;
  deregisterConfirmationOptions: () => void;
}
const ConfirmNavigationContext = createContext<ConfirmNavigationContextValue>({
  registerConfirmationOptions: () => {
    throw new Error(
      "Trying to use ConfirmNavigationContext#registerConfirmationOptions without using ConfirmNavigationContextProvider",
    );
  },
  deregisterConfirmationOptions: () => {
    throw new Error(
      "Trying to use ConfirmNavigationContext#deregisterConfirmationOptions without using ConfirmNavigationContextProvider",
    );
  },
});

export function ConfirmNavigationProvider({ children }: RequiresChildren) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const confirmationOptionsRef =
    useRef<SettableConfirmationDialogOptions | null>(null);

  const { t } = useTranslation();

  function onBeforeNavigate(
    onNavigate: () => void,
    onBeforeNavigateProps?: OnBeforeNavigateProps,
  ) {
    async function onConfirm() {
      await confirmationOptionsRef?.current?.onConfirm?.();
      onNavigate();
    }
    if (onBeforeNavigateProps?.onSaveMutation !== undefined) {
      openConfirmationDialog({
        onConfirmMutation: onBeforeNavigateProps?.onSaveMutation,
        onDeny: onNavigate,
        title: t("confirmation_dialog.title"),
        color: "primary",
        description: t("cancel_dialog.description_unsaved"),
        confirmLabel: t("confirmation_dialog.confirm_label"),
        denyLabel: t("cancel_dialog.confirm_label"),
        cancelLabel: t("confirmation_dialog.cancel_label"),
        ...confirmationOptionsRef?.current,
        onConfirm,
      });
    } else {
      openConfirmationDialog({
        title: t("cancel_dialog.title"),
        color: "danger",
        description: t("cancel_dialog.description_unsaved"),
        confirmLabel: t("cancel_dialog.confirm_label"),
        cancelLabel: t("confirmation_dialog.cancel_label"),
        ...confirmationOptionsRef?.current,
        onConfirm,
      });
    }
  }

  const value = useMemo(
    () => ({
      registerConfirmationOptions(
        givenOptions: SettableConfirmationDialogOptions,
      ) {
        const oldOptions = confirmationOptionsRef.current;
        const options = isEmpty(givenOptions) ? null : givenOptions;
        if (oldOptions === options) {
          return;
        }
        if (oldOptions) {
          throw new Error(
            "Cannot register more than one confirmation dialog at a time",
          );
        }
        confirmationOptionsRef.current = options;
      },
      deregisterConfirmationOptions() {
        confirmationOptionsRef.current = null;
      },
    }),
    [],
  );

  return (
    <ConfirmNavigationContext.Provider value={value}>
      <NavigationContextProvider onBeforeNavigate={onBeforeNavigate}>
        {children}
      </NavigationContextProvider>
    </ConfirmNavigationContext.Provider>
  );
}

export function useConfirmNavigation(
  options: SettableConfirmationDialogOptions,
) {
  const { registerConfirmationOptions, deregisterConfirmationOptions } =
    useContext(ConfirmNavigationContext);

  useEffect(() => {
    registerConfirmationOptions(options);
    return deregisterConfirmationOptions;
  }, [options, registerConfirmationOptions, deregisterConfirmationOptions]);

  return;
}
