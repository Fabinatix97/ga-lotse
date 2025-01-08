/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ConfirmationDialogContext,
  ConfirmationDialogOptions,
} from "@eshg/lib-portal/components/confirmationDialog/ConfirmationDialogProvider";
import { useContext, useMemo } from "react";
import { isDefined } from "remeda";

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
        title: t("cancelDialog.title"),
        description: t("cancelDialog.description"),
        confirmLabel: t("cancelDialog.confirmLabel"),
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
