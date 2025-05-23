/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useContext, useMemo } from "react";
import { isDefined } from "remeda";

import {
  ConfirmationDialogContext,
  ConfirmationDialogOptions,
} from "@eshg/lib-portal";

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
