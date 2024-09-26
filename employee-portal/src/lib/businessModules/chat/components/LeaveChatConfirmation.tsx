/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ConfirmationDialog,
  ConfirmationDialogProps,
} from "@/lib/shared/components/confirmationDialog/ConfirmationDialog";

export function LeaveChatConfirmation(props: ConfirmationDialogProps) {
  return (
    <ConfirmationDialog
      color="danger"
      title="Wollen Sie den Chat wirklich verlassen?"
      description="Wenn Sie den Chat verlassen, können Sie keine neuen Nachrichten mehr empfangen."
      key="leave-room-dialog"
      confirmLabel="Verlassen"
      {...props}
    />
  );
}
