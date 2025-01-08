/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  BaseConfirmationDialog,
  ConfirmationDialogProps,
} from "@eshg/lib-portal/components/confirmationDialog/BaseConfirmationDialog";
import { BaseConfirmationDialogButtonBar } from "@eshg/lib-portal/components/confirmationDialog/BaseConfirmationDialogButtonBar";

export function EmployeePortalConfirmationDialog({
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
