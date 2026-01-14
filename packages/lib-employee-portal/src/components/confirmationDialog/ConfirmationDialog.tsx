/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  BaseConfirmationDialog,
  BaseConfirmationDialogButtonBar,
  ConfirmationDialogProps,
} from "@eshg/lib-portal";

export function ConfirmationDialog({
  title = "Änderung speichern?",
  description = "Möchten Sie die Änderung wirklich speichern?",
  confirmLabel = "Speichern",
  cancelLabel = "Abbrechen",
  ...props
}: Readonly<ConfirmationDialogProps>) {
  return (
    <BaseConfirmationDialog
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      buttonBarComponent={BaseConfirmationDialogButtonBar}
      {...props}
    />
  );
}
