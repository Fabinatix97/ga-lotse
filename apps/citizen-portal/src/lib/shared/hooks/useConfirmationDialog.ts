/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useContext, useMemo } from "react";
import { isDefined } from "remeda";

import {
  ConfirmationDialogContext,
  ConfirmationDialogOptions,
} from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";

export function useConfirmationDialog() {
  const context = useContext(ConfirmationDialogContext);
  if (context === null) {
    throw new Error(
      "useConfirmationDialog was called outside ConfirmationDialogProvider",
    );
  }
  const { setConfirmationDialog } = context;
  const { t } = useTranslation();

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
        title: t("cancel_dialog.title"),
        description: t("cancel_dialog.description"),
        confirmLabel: t("cancel_dialog.confirm_label"),
        color: "danger",
        ...options,
      });
    }

    return {
      openConfirmationDialog,
      openCancelDialog,
    };
  }, [setConfirmationDialog, t]);
}
